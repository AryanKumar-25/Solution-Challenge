import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, Info, X, Bell } from "lucide-react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, dur) => addToast(msg, "success", dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, "error", dur), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, "info", dur), [addToast]);
  const notify = useCallback((msg, dur) => addToast(msg, "notify", dur || 6000), [addToast]);

  const icons = {
    success: <CheckCircle size={20} color="#2DCB73" style={{ flexShrink: 0 }} />,
    error: <AlertTriangle size={20} color="#FF4D8D" style={{ flexShrink: 0 }} />,
    info: <Info size={20} color="#6B4EFF" style={{ flexShrink: 0 }} />,
    notify: <Bell size={20} color="#FF6B35" style={{ flexShrink: 0 }} />,
  };

  const bgStyles = {
    success: { background: "#E6F9EE", borderColor: "#2DCB73" },
    error: { background: "#FFE8F2", borderColor: "#FF4D8D" },
    info: { background: "#EDE9FF", borderColor: "#6B4EFF" },
    notify: { background: "#FFF0EA", borderColor: "#FF6B35" },
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, notify }}>
      {children}

      {/* Toast container */}
      <div style={{
        position: "fixed", top: 16, right: 16, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 8,
        maxWidth: 380, width: "100%", pointerEvents: "none",
      }}>
        {toasts.map((toast) => {
          const bg = bgStyles[toast.type] || bgStyles.info;
          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: "auto",
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: 16, borderRadius: 16,
                border: `1.5px solid ${bg.borderColor}`,
                background: bg.background,
                boxShadow: "0 8px 32px rgba(107,78,255,0.15)",
                animation: "slideRight 0.3s ease-out",
              }}
            >
              {icons[toast.type] || icons.info}
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
                fontWeight: 500, color: "#1A1A2E", flex: 1, lineHeight: 1.5,
              }}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9CA3AF", flexShrink: 0, padding: 2,
                  display: "flex",
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
