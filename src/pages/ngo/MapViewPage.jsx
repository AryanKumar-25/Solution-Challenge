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
  if (score >= 8) return "#EF4444";
  if (score >= 4) return "#F59E0B";
  return "#22C55E";
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
      <div className="max-w-7xl mx-auto h-[calc(100vh-120px)]" id="map-view-page">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button onClick={() => navigate("/ngo/dashboard")} className="btn-ghost text-sm mb-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Map View</h1>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" />Critical</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500" />Moderate</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500" />Low</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden h-[calc(100%-80px)]">
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
                      <div className="p-1 max-w-xs">
                        <h3 className="font-bold text-sm mb-1 capitalize">{need.category}</h3>
                        <p className="text-xs text-gray-600 mb-2">{need.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <UrgencyBadge score={need.urgencyScore} />
                          <span className="text-xs text-gray-500">{need.locationName}</span>
                        </div>
                        <button
                          onClick={() => handleAssign(need)}
                          disabled={assigning === need.id}
                          className="w-full px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                        >
                          {assigning === need.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
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
