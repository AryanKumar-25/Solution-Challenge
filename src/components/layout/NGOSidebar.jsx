import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  Upload,
  MapPin,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/ngo/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/ngo/submit-need", icon: PlusCircle, label: "Submit Need" },
  { to: "/ngo/upload-survey", icon: Upload, label: "Upload Survey" },
  { to: "/ngo/map", icon: MapPin, label: "Map View" },
];

export default function NGOSidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const initials = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "N";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#E8F4FD" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }}
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0, bottom: 0, left: 0,
          width: 260,
          background: "linear-gradient(135deg, #6B4EFF 0%, #8B72FF 100%)",
          display: "flex",
          flexDirection: "column",
          zIndex: 50,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          boxShadow: "2px 0 12px rgba(107,78,255,0.2)",
        }}
        className="lg:!translate-x-0 lg:!static"
      >
        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "#FF6B35",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
          }}>
            <Heart size={20} color="white" fill="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: "white", letterSpacing: "-0.02em" }}>
              VolunteerBridge
            </h1>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              NGO Dashboard
            </p>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 12,
                  color: isActive ? "white" : "rgba(255,255,255,0.7)",
                  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 14,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                })}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 8 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#FF6B35",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "white",
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.displayName || user?.email || "NGO Coordinator"}
              </p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 12, width: "100%",
              background: "none", border: "none",
              color: "#FCA5A5", cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 14,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Mobile header */}
        <header
          className="lg:hidden"
          style={{
            position: "sticky", top: 0, zIndex: 30,
            background: "white",
            boxShadow: "0 2px 12px rgba(107,78,255,0.08)",
            padding: "10px 16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 10 }}
            >
              <Menu size={20} color="#1A1A2E" />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "#6B4EFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Heart size={16} color="white" fill="white" />
              </div>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, color: "#1A1A2E" }}>
                VolunteerBridge
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1, padding: "16px",
          animation: "fadeUp 0.35s ease-out",
        }}
          className="lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
