import React from "react";

export default function InfoPanel({ selectedNode, nodes, edges }) {
  const lowEdge = selectedNode && edges.find((edge) => edge.source === selectedNode.id && edge.type === "low");
  const highEdge = selectedNode && edges.find((edge) => edge.source === selectedNode.id && edge.type === "high");
  const lowNode = lowEdge && nodes.find((node) => node.id === lowEdge.target);
  const highNode = highEdge && nodes.find((node) => node.id === highEdge.target);

  return (
    <aside style={styles.panel}>
      <section style={styles.card}>
        <h2 style={styles.title}>Node Details</h2>
        {selectedNode ? (
          selectedNode.terminal ? (
            <>
              <p style={styles.text}><strong>Node:</strong> terminal {selectedNode.label}</p>
              <p style={styles.text}>This is the final result of one or more decision paths.</p>
            </>
          ) : (
            <>
              <p style={styles.text}><strong>Node:</strong> {selectedNode.label}</p>
              <p style={styles.text}><strong>Level:</strong> {selectedNode.level + 1}</p>
              <p style={styles.text}><strong>0-branch:</strong> {lowNode?.label || "not visible yet"}</p>
              <p style={styles.text}><strong>1-branch:</strong> {highNode?.label || "not visible yet"}</p>
            </>
          )
        ) : (
          <p style={styles.text}>Hover over a graph node to see its low and high branches.</p>
        )}
      </section>
    </aside>
  );
}

const styles = {
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: 0,
  },
  card: {
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "14px",
    textAlign: "left",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "16px",
    color: "#f8fafc",
  },
  text: {
    margin: "8px 0",
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: 1.5,
  },
};
