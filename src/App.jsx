import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";
import ErrorMessage from "./components/ErrorMessage";
import BDDViewer from "./components/BDDViewer";
import InfoPanel from "./components/InfoPanel";
import { validateFormula } from "./utils/validateFormula";
import { buildBDD } from "./services/bddService";
import { exportGraphAsImage } from "./utils/exportGraph";

export default function App() {
  const [formula, setFormula] = useState("");
  const [variableOrder, setVariableOrder] = useState("x1,x2,x3,x4");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [operation, setOperation] = useState("AND");
  const [secondFormula, setSecondFormula] = useState("x3");

  useEffect(() => {
    if (!formula.trim()) {
      setSteps([]);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setError("");
        setLoading(true);
        validateFormula(formula);

        const order = variableOrder.split(",").map(i => i.trim()).filter(Boolean);
        const animationSteps = await buildBDD(formula, order);

        setSteps(animationSteps);
        setCurrentStep(0);
        setSelectedNode(null);
      } catch (err) {
        setSteps([]);
        setError(err.message || "Failed to process formula.");
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formula, variableOrder]);

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length - 1) {
      const playTimer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(playTimer);
    }
  }, [steps, currentStep]);

  const handleReset = () => {
    setFormula("");
    setVariableOrder("x1,x2,x3,x4");
    setSteps([]);
    setCurrentStep(0);
    setError("");
    setSelectedNode(null);
    setOperation("AND");
    setSecondFormula("x3");
  };

  const handleApplyOperation = () => {
    if (!formula.trim()) {
      setError("Enter the first formula before applying an operation.");
      return;
    }

    if (operation !== "NOT" && !secondFormula.trim()) {
      setError("Enter a second formula for this operation.");
      return;
    }

    const operatorMap = {
      AND: "&",
      OR: "|",
      XOR: "^",
      EQUIV: "<->",
    };

    const newFormula = operation === "NOT"
      ? `~(${formula})`
      : `(${formula}) ${operatorMap[operation]} (${secondFormula})`;

    setFormula(newFormula);
    setError("");
  };

  const handleExport = async () => {
    try {
      await exportGraphAsImage("bdd-graph", "bdd-diagram");
    } catch (err) {
      setError("Failed to export image.");
    }
  };

  const currentGraph = steps[currentStep] || { nodes: [], edges: [] };

  return (
    <div style={styles.app}>
      <Header />
      <div style={styles.main}>
        <div style={styles.leftPanel}>
          <ControlPanel
            formula={formula}
            setFormula={setFormula}
            variableOrder={variableOrder}
            setVariableOrder={setVariableOrder}
            onReset={handleReset}
            onExport={handleExport}
            loading={loading}
            totalSteps={steps.length}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            operation={operation}
            setOperation={setOperation}
            secondFormula={secondFormula}
            setSecondFormula={setSecondFormula}
            onApplyOperation={handleApplyOperation}
          />
          {loading && <div style={styles.status}>Processing...</div>}
          <ErrorMessage message={error} />
        </div>

        <div style={styles.graphPanel}>
          <BDDViewer
            nodes={currentGraph.nodes}
            edges={currentGraph.edges}
            onNodeHover={setSelectedNode}
          />
        </div>

        <InfoPanel
          selectedNode={selectedNode}
          nodes={currentGraph.nodes}
          edges={currentGraph.edges}
        />
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    width: "100vw",
    background: "#0f172a",
    color: "#e2e8f0",
    overflowX: "hidden",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "minmax(310px, 360px) minmax(0, 1fr) minmax(280px, 340px)",
    gap: "16px",
    padding: "16px",
    width: "100%",
    maxWidth: "100%",
    alignItems: "stretch",
  },
  leftPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: 0,
  },
  graphPanel: {
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "12px",
    minHeight: "calc(100vh - 160px)",
    padding: "12px",
    minWidth: 0,
    overflow: "hidden",
  },
  status: { color: "#38bdf8", fontSize: "13px", fontStyle: "italic" }
};
