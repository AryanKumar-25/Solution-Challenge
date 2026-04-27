export default function LoadingSpinner({ size = "md", text = "" }) {
  const sizes = { sm: 20, md: 32, lg: 48 };
  const s = sizes[size] || sizes.md;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 12, padding: "32px 0",
    }}>
      <div style={{ width: s, height: s, position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2.5px solid rgba(107,78,255,0.15)",
        }} />
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2.5px solid transparent", borderTopColor: "#6B4EFF",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
      {text && (
        <p style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500,
          fontSize: 14, color: "#6B7280",
          animation: "pulse 2s ease-in-out infinite",
        }}>
          {text}
        </p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
