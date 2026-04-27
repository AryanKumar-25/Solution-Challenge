import UrgencyBadge from "./UrgencyBadge";
import { MapPin, Clock } from "lucide-react";

const categoryIcons = {
  food: "🍱",
  medical: "🏥",
  shelter: "🏠",
  education: "📚",
};

const statusStyles = {
  open: { bg: "#EDE9FF", color: "#6B4EFF" },
  assigned: { bg: "#FFE8F2", color: "#FF4D8D" },
  resolved: { bg: "#E6F9EE", color: "#2DCB73" },
};

export default function NeedCard({ need, onClick, actions }) {
  const s = statusStyles[need.status] || { bg: "#F3F4F6", color: "#6B7280" };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: 20,
        boxShadow: "0 4px 24px rgba(107,78,255,0.10)",
        border: "1.5px solid transparent",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={() => onClick?.(need)}
      id={`need-card-${need.id}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(107,78,255,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(107,78,255,0.10)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{categoryIcons[need.category] || "📋"}</span>
          <span style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 16,
            color: "#1A1A2E", textTransform: "capitalize",
          }}>
            {need.category}
          </span>
        </div>
        <UrgencyBadge score={need.urgencyScore} />
      </div>

      {/* Description */}
      <p style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 14,
        color: "#1A1A2E", lineHeight: 1.6, marginBottom: 12,
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {need.description}
      </p>

      {/* Meta */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: actions ? 12 : 0 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "4px 12px", borderRadius: 999,
          background: "#EDE9FF", color: "#6B4EFF",
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 13,
        }}>
          <MapPin size={12} /> {need.locationName || "Unknown"}
        </span>
        <span style={{
          padding: "3px 10px", borderRadius: 999,
          background: s.bg, color: s.color,
          fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11,
          textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          {need.status}
        </span>
        {need.createdAt && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#9CA3AF",
          }}>
            <Clock size={12} />
            {need.createdAt.toDate
              ? need.createdAt.toDate().toLocaleDateString()
              : "Recent"}
          </span>
        )}
      </div>

      {/* Actions */}
      {actions && <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>{actions}</div>}
    </div>
  );
}
