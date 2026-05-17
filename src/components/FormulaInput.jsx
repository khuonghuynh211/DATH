import React from "react";

export default function FormulaInput({ value, onChange }) {
  return (
    <div style={styles.wrapper}>
      <label htmlFor="formula" style={styles.label}>
        Boolean Formula
      </label>

      <textarea
        id="formula"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Example: (~x2 & (x1 | x4)) <-> x3"
        style={styles.textarea}
        rows={5}
      />

      <div style={styles.helpBox}>
        <div style={styles.helpTitle}>Supported operators</div>
        <div style={styles.helpText}>~ : NOT</div>
        <div style={styles.helpText}>& : AND</div>
        <div style={styles.helpText}>| : OR</div>
        <div style={styles.helpText}>^ : XOR</div>
        <div style={styles.helpText}>&lt;-&gt; : EQUIVALENT</div>
      </div>
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
  textarea: {
    width: "100%",
    resize: "vertical",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#0f172a",
    color: "#e2e8f0",
    padding: "12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  helpBox: {
    background: "#0b1220",
    border: "1px solid #334155",
    borderRadius: "8px",
    padding: "10px",
  },
  helpTitle: {
    fontWeight: "600",
    marginBottom: "6px",
    color: "#cbd5e1",
  },
  helpText: {
    fontSize: "13px",
    color: "#94a3b8",
    lineHeight: 1.6,
  },
};