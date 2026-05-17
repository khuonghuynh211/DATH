import React from "react";

export default function VariableOrderInput({ value, onChange }) {
  return (
    <div style={styles.wrapper}>
      <label htmlFor="variable-order" style={styles.label}>
        Variable Ordering
      </label>

      <input
        id="variable-order"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="x1,x2,x3,x4"
        style={styles.input}
      />

      <p style={styles.note}>
        Enter variables separated by commas. Example: x1,x2,x3,x4
      </p>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "600",
    color: "#f8fafc",
  },
  input: {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  note: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
  },
};