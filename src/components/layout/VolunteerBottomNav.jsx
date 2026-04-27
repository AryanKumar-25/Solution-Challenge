import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";
import { Home, MapPin, ClipboardList, User, LogOut, Heart, Bell } from "lucide-react";

const navItems = [
  { to: "/volunteer/home", icon: Home, label: "Home" },
  { to: "/volunteer/map", icon: MapPin, label: "Map" },
  { to: "/volunteer/tasks", icon: ClipboardList, label: "Tasks" },
  { to: "/volunteer/profile", icon: User, label: "Profile" },
];

export default function VolunteerBottomNav({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const initials = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "V";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#E8F4FD" }}>
      {/* Top header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 30,
        background: "white",
        boxShadow: "0 2px 12px rgba(107,78,255,0.08)",
        padding: "10px 16px",
      }}>
        <div style={{ maxWidth: 768, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: "#6B4EFF",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Heart size={16} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, color: "#1A1A2E" }}>
              VolunteerBridge
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Notification bell */}
            <button
              style={{
                position: "relative", background: "none", border: "none", cursor: "pointer",
                padding: 6, borderRadius: 10, color: "#6B7280",
              }}
            >
              <Bell size={20} />
              <span style={{
                position: "absolute", top: 4, right: 4, width: 8, height: 8,
                borderRadius: "50%", background: "#FF4D8D", border: "2px solid white",
              }} />
            </button>
            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#6B4EFF",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: "white",
              cursor: "pointer",
            }}
              onClick={() => navigate("/volunteer/profile")}
            >
              {initials}
            </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: 6, borderRadius: 10, color: "#9CA3AF",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => e.target.style.color = "#FF4D8D"}
              onMouseLeave={(e) => e.target.style.color = "#9CA3AF"}
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{
        flex: 1, padding: "16px 16px 96px",
        maxWidth: 768, margin: "0 auto", width: "100%",
        animation: "fadeUp 0.35s ease-out",
      }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
        background: "white",
        boxShadow: "0 -4px 20px rgba(107,78,255,0.08)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", maxWidth: 480, margin: "0 auto", padding: "4px 0" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 2, padding: "8px 16px", textDecoration: "none",
                color: isActive ? "#6B4EFF" : "#9CA3AF",
                position: "relative", borderRadius: 12,
                transition: "color 0.2s ease",
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div style={{
                      position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
                      width: 36, height: 36, background: "#EDE9FF", borderRadius: 10, zIndex: -1,
                    }} />
                  )}
                  <item.icon size={20} />
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 11,
                  }}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
