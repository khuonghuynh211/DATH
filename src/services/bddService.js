/**
 * Boolean Formula to ROBDD service
 *
 * Supported syntax:
 *   ~       NOT
 *   &       AND
 *   |       OR
 *   ^       XOR
 *   <->     Equivalence
 *   (...)   Parentheses
 *   x1, x2  Variables
 *   0, 1    Boolean constants
 *
 * The algorithm uses the standard ROBDD construction rules:
 *   1. Parse the formula into an abstract syntax tree (AST).
 *   2. Recursively expand variables according to the selected order.
 *   3. Remove redundant nodes where low child === high child.
 *   4. Merge duplicate nodes using a unique table.
 */
export async function buildBDD(formula, variableOrder) {
  // Small delay keeps the existing UI loading animation visible.
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!formula || !formula.trim()) {
    throw new Error("Formula is required.");
  }

  const order = normalizeVariableOrder(variableOrder);
  if (order.length === 0) {
    throw new Error("Variable ordering is required. Example: x1,x2,x3");
  }

  const tokens = tokenize(formula);
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const formulaVariables = [...collectVariables(ast)].sort(naturalVariableSort);

  const missingVariables = formulaVariables.filter((variable) => !order.includes(variable));
  if (missingVariables.length > 0) {
    throw new Error(
      `Variable ordering is missing: ${missingVariables.join(", ")}. Add them to the order list.`
    );
  }

  const robdd = createROBDD(ast, order);
  return createAnimationSteps(robdd.root, robdd.nodes, order);
}

function normalizeVariableOrder(variableOrder) {
  const order = Array.isArray(variableOrder)
    ? variableOrder.map((item) => String(item).trim()).filter(Boolean)
    : String(variableOrder || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const seen = new Set();
  for (const variable of order) {
    if (!isValidVariableName(variable)) {
      throw new Error(`Invalid variable name in ordering: ${variable}`);
    }
    if (seen.has(variable)) {
      throw new Error(`Duplicate variable in ordering: ${variable}`);
    }
    seen.add(variable);
  }

  return order;
}

function isValidVariableName(value) {
  return /^[A-Za-z][A-Za-z0-9_]*$/.test(value);
}

function naturalVariableSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function tokenize(input) {
  const tokens = [];
  let index = 0;

  while (index < input.length) {
    const char = input[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (input.startsWith("<->", index)) {
      tokens.push({ type: "operator", value: "<->" });
      index += 3;
      continue;
    }

    if (["~", "&", "|", "^", "(", ")"].includes(char)) {
      tokens.push({
        type: char === "(" || char === ")" ? "paren" : "operator",
        value: char,
      });
      index += 1;
      continue;
    }

    if (char === "0" || char === "1") {
      tokens.push({ type: "constant", value: char === "1" });
      index += 1;
      continue;
    }

    if (/[A-Za-z]/.test(char)) {
      let end = index + 1;
      while (end < input.length && /[A-Za-z0-9_]/.test(input[end])) {
        end += 1;
      }
      tokens.push({ type: "variable", value: input.slice(index, end) });
      index = end;
      continue;
    }

    throw new Error(`Invalid character '${char}' in formula.`);
  }

  if (tokens.length === 0) {
    throw new Error("Formula cannot be empty.");
  }

  return tokens;
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  parse() {
    const expression = this.parseEquivalence();
    if (!this.isAtEnd()) {
      throw new Error(`Unexpected token '${this.peek().value}'.`);
    }
    return expression;
  }

  // Lowest precedence: equivalence
  parseEquivalence() {
    let left = this.parseXor();
    while (this.matchOperator("<->")) {
      const right = this.parseXor();
      left = { type: "binary", operator: "<->", left, right };
    }
    return left;
  }

  parseXor() {
    let left = this.parseOr();
    while (this.matchOperator("^")) {
      const right = this.parseOr();
      left = { type: "binary", operator: "^", left, right };
    }
    return left;
  }

  parseOr() {
    let left = this.parseAnd();
    while (this.matchOperator("|")) {
      const right = this.parseAnd();
      left = { type: "binary", operator: "|", left, right };
    }
    return left;
  }

  parseAnd() {
    let left = this.parseNot();
    while (this.matchOperator("&")) {
      const right = this.parseNot();
      left = { type: "binary", operator: "&", left, right };
    }
    return left;
  }

  parseNot() {
    if (this.matchOperator("~")) {
      return { type: "not", child: this.parseNot() };
    }
    return this.parsePrimary();
  }

  parsePrimary() {
    if (this.matchParen("(")) {
      const expression = this.parseEquivalence();
      if (!this.matchParen(")")) {
        throw new Error("Missing closing parenthesis.");
      }
      return expression;
    }

    const token = this.advance();
    if (!token) {
      throw new Error("Unexpected end of formula.");
    }

    if (token.type === "variable") {
      return { type: "variable", name: token.value };
    }

    if (token.type === "constant") {
      return { type: "constant", value: token.value };
    }

    throw new Error(`Unexpected token '${token.value}'.`);
  }

  matchOperator(operator) {
    if (this.peek()?.type === "operator" && this.peek().value === operator) {
      this.position += 1;
      return true;
    }
    return false;
  }

  matchParen(paren) {
    if (this.peek()?.type === "paren" && this.peek().value === paren) {
      this.position += 1;
      return true;
    }
    return false;
  }

  advance() {
    if (this.isAtEnd()) return null;
    const token = this.tokens[this.position];
    this.position += 1;
    return token;
  }

  peek() {
    return this.tokens[this.position];
  }

  isAtEnd() {
    return this.position >= this.tokens.length;
  }
}

function collectVariables(ast, variables = new Set()) {
  if (ast.type === "variable") {
    variables.add(ast.name);
    return variables;
  }

  if (ast.type === "not") {
    return collectVariables(ast.child, variables);
  }

  if (ast.type === "binary") {
    collectVariables(ast.left, variables);
    collectVariables(ast.right, variables);
  }

  return variables;
}

function evaluateAST(ast, assignment) {
  switch (ast.type) {
    case "constant":
      return ast.value;
    case "variable":
      return Boolean(assignment[ast.name]);
    case "not":
      return !evaluateAST(ast.child, assignment);
    case "binary": {
      const left = evaluateAST(ast.left, assignment);
      const right = evaluateAST(ast.right, assignment);

      switch (ast.operator) {
        case "&":
          return left && right;
        case "|":
          return left || right;
        case "^":
          return left !== right;
        case "<->":
          return left === right;
        default:
          throw new Error(`Unsupported operator: ${ast.operator}`);
      }
    }
    default:
      throw new Error(`Unsupported AST node type: ${ast.type}`);
  }
}

function createROBDD(ast, order) {
  const terminalZero = {
    id: "t0",
    label: "0",
    terminal: true,
    level: order.length,
  };
  const terminalOne = {
    id: "t1",
    label: "1",
    terminal: true,
    level: order.length,
  };

  const uniqueTable = new Map();
  let nextNodeId = 1;

  function makeNode(level, low, high) {
    // Reduction rule 1: eliminate redundant tests.
    if (low.id === high.id) {
      return low;
    }

    const variable = order[level];
    const key = `${variable}|${low.id}|${high.id}`;

    // Reduction rule 2: merge equivalent subgraphs.
    if (uniqueTable.has(key)) {
      return uniqueTable.get(key);
    }

    const node = {
      id: `n${nextNodeId}`,
      label: variable,
      variable,
      terminal: false,
      level,
      low,
      high,
    };
    nextNodeId += 1;
    uniqueTable.set(key, node);
    return node;
  }

  function buildAtLevel(level, assignment) {
    if (level === order.length) {
      return evaluateAST(ast, assignment) ? terminalOne : terminalZero;
    }

    const variable = order[level];
    const low = buildAtLevel(level + 1, { ...assignment, [variable]: false });
    const high = buildAtLevel(level + 1, { ...assignment, [variable]: true });

    return makeNode(level, low, high);
  }

  const root = buildAtLevel(0, {});
  const reachableNodes = collectReachableNodes(root, terminalZero, terminalOne);

  return {
    root,
    nodes: reachableNodes,
  };
}

function collectReachableNodes(root, terminalZero, terminalOne) {
  const nodeMap = new Map();

  function visit(node) {
    if (!node || nodeMap.has(node.id)) return;
    nodeMap.set(node.id, node);
    if (!node.terminal) {
      visit(node.low);
      visit(node.high);
    }
  }

  visit(root);

  // Keep terminals visible if they are reachable.
  if (nodeMap.has("t0")) nodeMap.set("t0", terminalZero);
  if (nodeMap.has("t1")) nodeMap.set("t1", terminalOne);

  return [...nodeMap.values()];
}

function createAnimationSteps(root, rawNodes, order) {
  const positionedNodes = layoutNodes(rawNodes, order);
  const finalEdges = createEdges(rawNodes);

  if (positionedNodes.length === 0) {
    return [{ nodes: [], edges: [] }];
  }

  const nonTerminalLevels = [
    ...new Set(positionedNodes.filter((node) => !node.terminal).map((node) => node.level)),
  ].sort((a, b) => a - b);

  const steps = [];

  for (const level of nonTerminalLevels) {
    const visibleNodeIds = new Set(
      positionedNodes
        .filter((node) => !node.terminal && node.level <= level)
        .map((node) => node.id)
    );

    steps.push({
      nodes: positionedNodes.filter((node) => visibleNodeIds.has(node.id)),
      edges: finalEdges.filter(
        (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
      ),
    });
  }

  // Final step includes terminal nodes and all branches.
  steps.push({ nodes: positionedNodes, edges: finalEdges });

  // Constant formulas such as "1" have no non-terminal levels.
  if (steps.length === 1 && root.terminal) {
    return [{ nodes: positionedNodes, edges: [] }];
  }

  return steps;
}

function layoutNodes(rawNodes, order) {
  const nodes = rawNodes.map((node) => ({ ...node }));
  const groups = new Map();

  for (const node of nodes) {
    const level = node.terminal ? order.length : node.level;
    if (!groups.has(level)) groups.set(level, []);
    groups.get(level).push(node);
  }

  const maxGroupSize = Math.max(...[...groups.values()].map((group) => group.length));
  const canvasWidth = Math.max(900, (maxGroupSize + 1) * 180);
  const verticalSpacing = 120;
  const topMargin = 70;

  for (const [level, group] of groups.entries()) {
    group.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
    const horizontalSpacing = canvasWidth / (group.length + 1);

    group.forEach((node, index) => {
      node.x = Math.round(horizontalSpacing * (index + 1));
      node.y = topMargin + level * verticalSpacing;
    });
  }

  return nodes.sort((a, b) => {
    if (a.terminal !== b.terminal) return a.terminal ? 1 : -1;
    if (a.level !== b.level) return a.level - b.level;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });
}

function createEdges(rawNodes) {
  const edges = [];

  for (const node of rawNodes) {
    if (node.terminal) continue;

    edges.push({
      id: `${node.id}-low`,
      source: node.id,
      target: node.low.id,
      label: "0",
      type: "low",
    });

    edges.push({
      id: `${node.id}-high`,
      source: node.id,
      target: node.high.id,
      label: "1",
      type: "high",
    });
  }

  return edges;
}
