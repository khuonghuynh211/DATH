import React, { useMemo, useState } from "react";

export default function BDDViewer({ nodes, edges, onNodeHover }) {
  const [scale, setScale] = useState(1);

  const { width, height } = useMemo(() => {
    const maxX = nodes.length ? Math.max(...nodes.map((n) => n.x)) : 700;
    const maxY = nodes.length ? Math.max(...nodes.map((n) => n.y)) : 500;
    return {
      width: Math.max(900, maxX + 120),
      height: Math.max(600, maxY + 120),
    };
  }, [nodes]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button onClick={zoomIn} style={styles.button}>
          Zoom In
        </button>
        <button onClick={zoomOut} style={styles.button}>
          Zoom Out
        </button>
        <button onClick={resetZoom} style={styles.button}>
          Reset View
        </button>
      </div>

      <div id="bdd-graph" style={styles.viewer}>
        {nodes.length === 0 ? (
          <div style={styles.placeholder}>
            BDD graph will appear here after generation.
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: `${width}px`,
              height: `${height}px`,
            }}
          >
            <svg width={width} height={height}>
              {edges.map((edge) => {
                const source = nodes.find((n) => n.id === edge.source);
                const target = nodes.find((n) => n.id === edge.target);
                if (!source || !target) return null;

                return (
                  <g key={edge.id}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={edge.type === "low" ? "#94a3b8" : "#38bdf8"}
                      strokeWidth="2"
                      strokeDasharray={edge.type === "low" ? "6 4" : "0"}
                    />
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 6}
                      fill="#cbd5e1"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {nodes.map((node) => (
                <g key={node.id} onMouseEnter={() => onNodeHover?.(node)} onMouseLeave={() => onNodeHover?.(null)} style={{ cursor: "pointer" }}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.terminal ? 24 : 28}
                    fill={node.terminal ? "#1d4ed8" : "#1e293b"}
                    stroke={node.terminal ? "#93c5fd" : "#64748b"}
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    fill="#f8fafc"
                    fontSize="14"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      <div style={styles.legend}>
        <span style={styles.legendItem}>
          <span style={{ ...styles.lineSample, borderTop: "2px solid #38bdf8" }} />
          1-branch
        </span>
        <span style={styles.legendItem}>
          <span
            style={{
              ...styles.lineSample,
              borderTop: "2px dashed #94a3b8",
            }}
          />
          0-branch
        </span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  toolbar: {
    display: "flex",
    gap: "8px",
  },
  button: {
    background: "#1e293b",
    color: "#e2e8f0",
    border: "1px solid #475569",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  viewer: {
    flex: 1,
    overflow: "auto",
    background: "#020617",
    border: "1px solid #334155",
    borderRadius: "10px",
    padding: "12px",
    minHeight: "520px",
  },
  placeholder: {
    color: "#94a3b8",
    fontSize: "15px",
    textAlign: "center",
    marginTop: "120px",
  },
  legend: {
    display: "flex",
    gap: "16px",
    color: "#cbd5e1",
    fontSize: "13px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  lineSample: {
    display: "inline-block",
    width: "28px",
  },
};