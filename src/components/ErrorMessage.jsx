import React from "react";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div style={styles.box}>
      <strong style={styles.title}>Error:</strong>
      <span style={styles.text}> {message}</span>
    </div>
  );
}

const styles = {
  box: {
    background: "#3f1d1d",
    border: "1px solid #7f1d1d",
    color: "#fecaca",
    borderRadius: "8px",
    padding: "12px",
  },
  title: {
    color: "#fca5a5",
  },
  text: {
    color: "#fecaca",
  },
};