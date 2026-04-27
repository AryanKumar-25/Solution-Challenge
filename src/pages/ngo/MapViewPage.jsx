import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { subscribeToOpenNeeds, updateNeed } from "../../services/needsService";
import { getAvailableVolunteers } from "../../services/volunteersService";
import { matchVolunteersToNeed } from "../../ai/volunteerMatcher";
import { createTask } from "../../services/tasksService";
import NGOSidebar from "../../components/layout/NGOSidebar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import UrgencyBadge from "../../components/common/UrgencyBadge";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";

const defaultCenter = [20.5937, 78.9629];

const getMarkerColor = (score) => {
  if (score >= 8) return "#FF4D8D";
  if (score >= 4) return "#FFD046";
  return "#2DCB73";
};

export default function MapViewPage() {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const unsub = subscribeToOpenNeeds((data) => {
      setNeeds(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAssign = async (need) => {
    setAssigning(need.id);
    try {
      const volunteers = await getAvailableVolunteers();
      const matches = matchVolunteersToNeed(volunteers, need);
      if (matches.length > 0) {
        const best = matches[0];
        await createTask({
          needId: need.id,
          assignedVolunteerId: best.volunteer.uid || best.volunteer.id,
          matchScore: best.score,
          needDescription: need.description,
          needCategory: need.category,
          needLocationName: need.locationName,
          needLat: need.lat,
          needLng: need.lng,
          needUrgencyScore: need.urgencyScore,
        });
        await updateNeed(need.id, { status: "assigned" });
        toast.success(`✅ Assigned to ${best.volunteer.name} (match score: ${best.score})`);
      } else {
        toast.error("No available volunteers match this need right now.");
      }
    } catch (err) {
      toast.error("Assignment failed. Please try again.");
      console.error("Assignment failed:", err);
    } finally {
      setAssigning(null);
    }
  };

  const mapCenter = needs.length > 0 && needs[0].lat
    ? [needs[0].lat, needs[0].lng]
    : defaultCenter;

  return (
    <NGOSidebar>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: "calc(100vh - 120px)" }} id="map-view-page">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <button
              onClick={() => navigate("/ngo/dashboard")}
              style={{
                display: "flex", alignItems: "center", gap: 6, background: "none",
                border: "none", cursor: "pointer", marginBottom: 8,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 14, color: "#6B7280",
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "#1A1A2E" }}>
              Map View 🗺️
            </h1>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF4D8D" }} />Critical
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFD046" }} />Moderate
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2DCB73" }} />Low
            </span>
          </div>
        </div>

        <div style={{
          background: "white", borderRadius: 20,
          boxShadow: "0 4px 24px rgba(107,78,255,0.10)",
          overflow: "hidden", height: "calc(100% - 80px)",
        }}>
          {loading ? (
            <LoadingSpinner text="Loading map data..." />
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={5}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {needs.map((need) =>
                need.lat && need.lng ? (
                  <CircleMarker
                    key={need.id}
                    center={[need.lat, need.lng]}
                    radius={10}
                    pathOptions={{
                      fillColor: getMarkerColor(need.urgencyScore),
                      fillOpacity: 0.9,
                      color: "#fff",
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div style={{ padding: 4, maxWidth: 240 }}>
                        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, textTransform: "capitalize", marginBottom: 4 }}>
                          {need.category}
                        </h3>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
                          {need.description}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <UrgencyBadge score={need.urgencyScore} />
                          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: "#9CA3AF" }}>
                            {need.locationName}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAssign(need)}
                          disabled={assigning === need.id}
                          style={{
                            width: "100%", padding: "6px 12px",
                            background: "#6B4EFF", color: "white",
                            border: "none", borderRadius: 8, cursor: "pointer",
                            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {assigning === need.id ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                          Assign Volunteer
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                ) : null
              )}
            </MapContainer>
          )}
        </div>
      </div>
    </NGOSidebar>
  );
}
