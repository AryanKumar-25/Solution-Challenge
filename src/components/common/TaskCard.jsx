import { useState } from "react";
import UrgencyBadge from "./UrgencyBadge";
import { MapPin, Navigation, CheckCircle, XCircle } from "lucide-react";

const categoryIcons = {
  food: "🍱",
  medical: "🏥",
  shelter: "🏠",
  education: "📚",
};

export default function TaskCard({
  need,
  distance,
  matchScore,
  taskStatus,
  onAccept,
  onDecline,
  onComplete,
  onClick,
}) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = (e) => {
    e.stopPropagation();
    setAccepted(true);
    setTimeout(() => onAccept?.(), 600);
  };

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
      id={`task-card-${need?.id}`}
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
          <span style={{ fontSize: 20 }}>{categoryIcons[need?.category] || "📋"}</span>
          <span style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 16,
            color: "#1A1A2E", textTransform: "capitalize",
          }}>
            {need?.category}
          </span>
        </div>
        <UrgencyBadge score={need?.urgencyScore || 5} />
      </div>

      {/* Description */}
      <p style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 14,
        color: "#1A1A2E", lineHeight: 1.6, marginBottom: 12,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {need?.description}
      </p>

      {/* Meta chips */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "4px 12px", borderRadius: 999,
          background: "#EDE9FF", color: "#6B4EFF",
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 13,
        }}>
          📍 {need?.locationName || "Unknown"}
        </span>
        {distance !== undefined && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 12px", borderRadius: 999,
            background: "#FFF0EA", color: "#FF6B35",
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 13,
          }}>
            🛵 {distance} km
          </span>
        )}
        {matchScore !== undefined && (
          <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "4px 14px", borderRadius: 999,
            background: "linear-gradient(135deg, #6B4EFF, #8B72FF)",
            color: "white",
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13,
          }}>
            {matchScore}% Match
          </span>
        )}
      </div>

      {/* Task Status */}
      {taskStatus && (
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "3px 12px", borderRadius: 6,
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.05em",
            ...(taskStatus === "accepted" ? { background: "#EDE9FF", color: "#6B4EFF" } :
               taskStatus === "done" ? { background: "#E6F9EE", color: "#2DCB73" } :
               taskStatus === "declined" ? { background: "#FFE8F2", color: "#FF4D8D" } :
               { background: "#FFF0EA", color: "#FF6B35" }),
          }}>
            {taskStatus}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
        {onAccept && (
          <button
            style={{
              flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: 6, padding: "10px 16px", borderRadius: 10, border: "none",
              background: accepted ? "#2DCB73" : "#2DCB73", color: "white",
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15,
              cursor: "pointer", transition: "all 0.2s ease",
              transform: accepted ? "scale(1.02)" : "scale(1)",
            }}
            onClick={handleAccept}
            onMouseEnter={(e) => { if (!accepted) e.target.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { if (!accepted) e.target.style.transform = "scale(1)"; }}
          >
            {accepted ? (
              <span style={{ animation: "springIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>✓ Accepted</span>
            ) : (
              <><CheckCircle size={16} /> Accept</>
            )}
          </button>
        )}
        {onDecline && (
          <button
            style={{
              flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center",
              gap: 6, padding: "10px 16px", borderRadius: 10,
              border: "1.5px solid #E5E7EB", background: "white", color: "#6B7280",
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15,
              cursor: "pointer", transition: "all 0.2s ease",
            }}
            onClick={(e) => { e.stopPropagation(); onDecline(); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFF0EA";
              e.currentTarget.style.borderColor = "#FF6B35";
              e.currentTarget.style.color = "#FF6B35";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            <XCircle size={16} /> Decline
          </button>
        )}
        {onComplete && (
          <button
            className="btn-accent"
            style={{ flex: 1, padding: "10px 16px", fontSize: 14, borderRadius: 10 }}
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
          >
            <CheckCircle size={16} /> Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}
