import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";
import { Home, MapPin, ClipboardList, User, LogOut, Heart } from "lucide-react";

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

  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      {/* Top header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-primary">VolunteerBridge</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 p-4 pb-24 max-w-3xl mx-auto w-full animate-fade-in">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-gray-100 
                       safe-area-inset-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto py-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `bottom-nav-item ${isActive ? "active" : ""}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
