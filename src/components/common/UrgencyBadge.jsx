import { getUrgencyLevel, getUrgencyLabel } from "../../ai/urgencyScorer";

export default function UrgencyBadge({ score }) {
  const level = getUrgencyLevel(score);

  const styles = {
    high: { bg: "#FFE8F2", color: "#FF4D8D", dot: "#FF4D8D" },
    medium: { bg: "#FFF8E1", color: "#E6A800", dot: "#FFD046" },
    low: { bg: "#E6F9EE", color: "#2DCB73", dot: "#2DCB73" },
  };

  const s = styles[level] || styles.low;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        background: s.bg,
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 700,
        fontSize: 11,
        color: s.color,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          animation: level === "high" ? "pulse 1.5s ease-in-out infinite" : "none",
        }}
      />
      {score}/10
    </span>
  );
}
