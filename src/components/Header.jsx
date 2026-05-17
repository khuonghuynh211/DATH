import React from "react";

export default function Header() {
  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>Boolean Formula to BDD Generator</h1>
        <p style={styles.subtitle}>
          Enter a Boolean formula, choose variable ordering, and visualize the
          Binary Decision Diagram.
        </p>
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: "20px 24px",
    borderBottom: "1px solid #334155",
    background: "#111827",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#f8fafc",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    fontSize: "14px",
    color: "#94a3b8",
  },
};