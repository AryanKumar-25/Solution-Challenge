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

  return (
    <NGOSidebar>
      <div className="max-w-7xl mx-auto" id="ngo-dashboard">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Community Needs Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage community needs in real-time
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/ngo/submit-need")}
              className="btn-accent text-sm"
              id="btn-submit-need"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Need
            </button>
            <button
              onClick={() => navigate("/ngo/upload-survey")}
              className="btn-outline text-sm"
              id="btn-upload-survey"
            >
              <Upload className="w-4 h-4" />
              Upload Survey
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Total</p>
                <p className="text-2xl font-bold text-white">{totalNeeds}</p>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Critical</p>
                <p className="text-2xl font-bold text-white">{criticalNeeds}</p>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Open</p>
                <p className="text-2xl font-bold text-white">{openNeeds}</p>
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Resolved</p>
                <p className="text-2xl font-bold text-white">{resolvedNeeds}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
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
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No needs reported yet</h3>
            <p className="text-gray-500 mb-6">Submit your first community need report</p>
            <button
              onClick={() => navigate("/ngo/submit-need")}
              className="btn-accent"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Need
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {needs.map((need, index) => (
              <div
                key={need.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
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
