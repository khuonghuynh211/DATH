import React from "react";

export default function OperationPanel({ operation, setOperation, secondFormula, setSecondFormula, onApply }) {
  const needsSecondFormula = operation !== "NOT";

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>BDD Operations</h3>
      <p style={styles.note}>Build a new formula using common BDD operations.</p>

      <select value={operation} onChange={(e) => setOperation(e.target.value)} style={styles.select}>
        <option value="AND">AND / Intersection</option>
        <option value="OR">OR / Union</option>
        <option value="XOR">XOR</option>
        <option value="EQUIV">Equivalent</option>
        <option value="NOT">NOT / Complement</option>
      </select>

      {needsSecondFormula && (
        <input
          value={secondFormula}
          onChange={(e) => setSecondFormula(e.target.value)}
          placeholder="Second formula, e.g. x3 | x4"
          style={styles.input}
        />
      )}

      <button onClick={onApply} style={styles.button}>Apply Operation</button>
    </div>
  );
}

const styles = {
  wrapper: {
    borderTop: "1px solid #1e293b",
    paddingTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  heading: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "16px",
  },
  note: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: 1.5,
  },
  select: {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "10px",
    outline: "none",
  },
  input: {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "10px",
    outline: "none",
  },
  button: {
    background: "#0ea5e9",
    color: "#00111f",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
