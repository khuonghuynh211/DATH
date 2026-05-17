export function validateFormula(formula) {
  if (!formula || !formula.trim()) {
    throw new Error("Formula cannot be empty.");
  }

  const trimmed = formula.trim();

  const allowedPattern = /^[A-Za-z0-9_()\s~&|^<>\-]+$/;
  if (!allowedPattern.test(trimmed)) {
    throw new Error(
      "Formula contains invalid characters. Allowed: variables, parentheses, ~, &, |, ^, <->"
    );
  }

  if (trimmed.includes(" v ")) {
    throw new Error("Invalid operator 'v'. Please use '|' for OR.");
  }

  if (!hasBalancedParentheses(trimmed)) {
    throw new Error("Mismatched parentheses.");
  }

  const variableMatches = trimmed.match(/\bx\d+\b/g);
  if (!variableMatches) {
    throw new Error("Formula must contain variables such as x1, x2, x3.");
  }

  return true;
}

function hasBalancedParentheses(input) {
  const stack = [];

  for (const char of input) {
    if (char === "(") stack.push(char);
    if (char === ")") {
      if (stack.length === 0) return false;
      stack.pop();
    }
  }

  return stack.length === 0;
}