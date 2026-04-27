import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { subscribeToNeeds } from "../../services/needsService";
import NGOSidebar from "../../components/layout/NGOSidebar";
import NeedCard from "../../components/common/NeedCard";
import CategoryFilter from "../../components/common/CategoryFilter";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  PlusCircle,
  Upload,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function NGODashboard() {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const prevStatusesRef = useRef(new Map());
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    const filters = {};
    if (categoryFilter) filters.category = categoryFilter;
    if (statusFilter) filters.status = statusFilter;

    const unsubscribe = subscribeToNeeds(filters, (updatedNeeds) => {
      // Notify NGO when a need's status changes (volunteer accepted/resolved)
      if (!isFirstLoadRef.current) {
        updatedNeeds.forEach((need) => {
          const prevStatus = prevStatusesRef.current.get(need.id);
          if (prevStatus && prevStatus !== need.status) {
            if (need.status === "assigned") {
              toast.success(`🙋 A volunteer accepted the ${need.category} need at ${need.locationName}!`);
            } else if (need.status === "resolved") {
              toast.success(`🎉 ${need.category} need at ${need.locationName} has been resolved!`);
            }
          }
          prevStatusesRef.current.set(need.id, need.status);
        });
      } else {
        updatedNeeds.forEach((n) => prevStatusesRef.current.set(n.id, n.status));
        isFirstLoadRef.current = false;
      }

      setNeeds(updatedNeeds);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryFilter, statusFilter]);

  // Compute stats
  const totalNeeds = needs.length;
  const openNeeds = needs.filter((n) => n.status === "open").length;
  const criticalNeeds = needs.filter((n) => n.urgencyScore >= 8).length;
  const resolvedNeeds = needs.filter((n) => n.status === "resolved").length;

  const statCards = [
    { icon: TrendingUp, label: "Total", value: totalNeeds, gradient: "linear-gradient(135deg, #6B4EFF, #8B72FF)" },
    { icon: AlertTriangle, label: "Critical", value: criticalNeeds, gradient: "linear-gradient(135deg, #FF4D8D, #FF7AAD)" },
    { icon: Users, label: "Open", value: openNeeds, gradient: "linear-gradient(135deg, #FF6B35, #FF8F5A)" },
    { icon: CheckCircle2, label: "Resolved", value: resolvedNeeds, gradient: "linear-gradient(135deg, #2DCB73, #5AD89A)" },
  ];

  return (
    <NGOSidebar>
      <div style={{ maxWidth: 1200, margin: "0 auto" }} id="ngo-dashboard">
        {/* Page header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginBottom: 32, gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 3vw, 30px)", color: "#1A1A2E" }}>
              Community Needs Dashboard 📊
            </h1>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 15, color: "#6B7280", marginTop: 4 }}>
              Track and manage community needs in real-time
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => navigate("/ngo/submit-need")} className="btn-accent" style={{ fontSize: 14, padding: "10px 20px" }} id="btn-submit-need">
              <PlusCircle size={16} /> Submit Need
            </button>
            <button onClick={() => navigate("/ngo/upload-survey")} className="btn-outline" style={{ fontSize: 14, padding: "10px 20px" }} id="btn-upload-survey">
              <Upload size={16} /> Upload Survey
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {statCards.map((s) => (
            <div
              key={s.label}
              style={{
                background: s.gradient,
                borderRadius: 20, padding: 24,
                color: "white", position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <s.icon size={22} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.7 }}>
                    {s.label}
                  </p>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28 }}>
                    {s.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: "white", borderRadius: 20, padding: 16, marginBottom: 24, boxShadow: "0 4px 24px rgba(107,78,255,0.10)" }}>
          <CategoryFilter
            selectedCategory={categoryFilter}
            selectedStatus={statusFilter}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Needs grid */}
        {loading ? (
          <LoadingSpinner text="Loading community needs..." />
        ) : needs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "#EDE9FF",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <PlusCircle size={36} color="#6B4EFF" />
            </div>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 20, color: "#1A1A2E", marginBottom: 4 }}>
              No needs reported yet
            </h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: "#6B7280", marginBottom: 24 }}>
              Submit your first community need report
            </p>
            <button onClick={() => navigate("/ngo/submit-need")} className="btn-accent">
              <PlusCircle size={16} /> Submit Need
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {needs.map((need, index) => (
              <div
                key={need.id}
                style={{ animation: `fadeUp 0.4s ease-out ${index * 0.05}s both` }}
              >
                <NeedCard need={need} onClick={() => {}} />
              </div>
            ))}
          </div>
        )}
      </div>
    </NGOSidebar>
  );
}
