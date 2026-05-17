import React from "react";
import FormulaInput from "./FormulaInput";
import VariableOrderInput from "./VariableOrderInput";
import OperationPanel from "./OperationPanel";

export default function ControlPanel({
  formula,
  setFormula,
  variableOrder,
  setVariableOrder,
  onReset,
  onExport,
  loading,
  totalSteps,
  currentStep,
  onStepChange,
  operation,
  setOperation,
  secondFormula,
  setSecondFormula,
  onApplyOperation
}) {
  return (
    <div style={styles.panel}>
      <h2 style={styles.title}>BDD Settings</h2>

      <FormulaInput value={formula} onChange={setFormula} />
      <VariableOrderInput value={variableOrder} onChange={setVariableOrder} />

      <OperationPanel
        operation={operation}
        setOperation={setOperation}
        secondFormula={secondFormula}
        setSecondFormula={setSecondFormula}
        onApply={onApplyOperation}
      />

      {totalSteps > 0 && (
        <div style={styles.timeline}>
          <label style={styles.label}>Construction Progress: {currentStep + 1}/{totalSteps}</label>
          <input
            type="range"
            min="0"
            max={totalSteps - 1}
            value={currentStep}
            onChange={(e) => onStepChange(parseInt(e.target.value))}
            style={styles.slider}
          />
        </div>
      )}

      <div style={styles.btnGroup}>
        <button onClick={onExport} disabled={loading || !formula} style={styles.primary}>
          Export PNG
        </button>
        <button onClick={onReset} style={styles.secondary}>
          Reset
        </button>
      </div>
    </div>
  );
}

const styles = {
  panel: { background: "#111827", border: "1px solid #334155", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" },
  title: { margin: 0, fontSize: "18px", color: "#f8fafc" },
  timeline: { borderTop: "1px solid #1e293b", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "12px", color: "#94a3b8" },
  slider: { width: "100%", accentColor: "#38bdf8", cursor: "pointer" },
  btnGroup: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  primary: { background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontWeight: "600", cursor: "pointer" },
  secondary: { background: "#1e293b", color: "#e2e8f0", border: "1px solid #475569", borderRadius: "8px", padding: "10px", cursor: "pointer" }
};
