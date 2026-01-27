import React from "react";

const STATUS_STEPS = [
  "pending",
  "under_review",
  "phone_screen",
  "technical_interview",
  "hr_interview",
  "offer",
  "rejected",
];

function StatusBar({ status = "pending", statusColors = {} }) {
  const safeStatus = STATUS_STEPS.includes(status) ? status : "pending";
  const currentIndex = STATUS_STEPS.indexOf(safeStatus);
  const rejectedMode = safeStatus === "rejected";

  const nodeColor = (step, idx) => {
    if (rejectedMode) return statusColors.rejected || "#ef4444";
    if (idx < currentIndex) return statusColors[step] || statusColors[safeStatus] || "#94a3b8";
    if (idx === currentIndex) return statusColors[safeStatus] || "#3b82f6";
    return "#e5e7eb";
  };

  const connectorColor = (step, idx) => {
    if (rejectedMode) return statusColors.rejected || "#ef4444";
    if (idx < currentIndex) return statusColors[step] || statusColors[safeStatus] || "#94a3b8";
    if (idx === currentIndex) return statusColors[safeStatus] || "#3b82f6";
    return "#d1d5db";
  };

  return (
    <div
      style={{
        marginTop: "0.9rem",
        padding: "0.9rem 1rem",
        borderRadius: "1.25rem",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ position: "relative", paddingBottom: "1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {STATUS_STEPS.map((step, idx) => {
            const isLast = idx === STATUS_STEPS.length - 1;
            const color = nodeColor(step, idx);
            return (
              <div
                key={step}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: color,
                    color: "#ffffff",
                    fontSize: "0.65rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 0 2px #f8fafc, 0 6px 12px rgba(15,23,42,0.15)`,
                  }}
                >
                  {idx + 1}
                </div>
                {!isLast && (
                  <div
                    style={{
                      flex: 1,
                      height: "5px",
                      borderRadius: "999px",
                      margin: "0 8px",
                      background: connectorColor(step, idx),
                      opacity: rejectedMode && step !== "rejected" ? 0.5 : 1,
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${STATUS_STEPS.length}, minmax(0, 1fr))`,
            gap: "0.35rem",
            fontSize: "0.68rem",
            marginTop: "0.65rem",
            color: "#475569",
            textTransform: "capitalize",
          }}
        >
          {STATUS_STEPS.map((step) => {
            const isActive = step === safeStatus;
            return (
              <span
                key={step}
                style={{
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#0f172a" : "#94a3b8",
                }}
              >
                {step.replace(/_/g, " ")}
              </span>
            );
          })}
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#0f172a",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {safeStatus.replace(/_/g, " ")}
      </div>
    </div>
  );
}

export default StatusBar;
