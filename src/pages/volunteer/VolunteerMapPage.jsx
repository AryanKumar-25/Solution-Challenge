import { useState, useEffect } from "react";
import { subscribeToOpenNeeds } from "../../services/needsService";
import VolunteerBottomNav from "../../components/layout/VolunteerBottomNav";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import UrgencyBadge from "../../components/common/UrgencyBadge";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Search } from "lucide-react";

const defaultCenter = [20.5937, 78.9629];

const getMarkerColor = (score) => {
  if (score >= 8) return "#FF4D8D";
  if (score >= 4) return "#FFD046";
  return "#2DCB73";
};

export default function VolunteerMapPage() {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = subscribeToOpenNeeds((data) => {
      setNeeds(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const mapCenter = needs.length > 0 && needs[0].lat
    ? [needs[0].lat, needs[0].lng]
    : defaultCenter;

  return (
    <VolunteerBottomNav>
      <div id="volunteer-map-page" style={{ animation: "fadeUp 0.35s ease-out" }}>
        <h1 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28,
          color: "#1A1A2E", marginBottom: 16,
        }}>
          Nearby Needs 📍
        </h1>

        <div style={{ position: "relative" }}>
          {/* Floating search bar */}
          <div style={{
            position: "absolute", top: 16, left: 16, right: 16, zIndex: 1000,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "white", borderRadius: 999, padding: "10px 20px",
              boxShadow: "0 4px 24px rgba(107,78,255,0.15)",
            }}>
              <Search size={18} color="#6B7280" />
              <input
                type="text"
                placeholder="Search needs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "none", outline: "none", flex: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "#1A1A2E",
                  background: "transparent",
                }}
              />
            </div>
          </div>

          <div style={{
            background: "white", borderRadius: 20,
            boxShadow: "0 4px 24px rgba(107,78,255,0.10)",
            overflow: "hidden", height: "60vh",
          }}>
            {loading ? (
              <LoadingSpinner text="Loading map..." />
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
                {needs
                  .filter((n) => !search || n.category?.includes(search.toLowerCase()) || n.locationName?.toLowerCase().includes(search.toLowerCase()))
                  .map((need) =>
                  need.lat && need.lng ? (
                    <CircleMarker
                      key={need.id}
                      center={[need.lat, need.lng]}
                      radius={8}
                      pathOptions={{
                        fillColor: getMarkerColor(need.urgencyScore),
                        fillOpacity: 0.9,
                        color: "#fff",
                        weight: 2,
                      }}
                    >
                      <Popup>
                        <div style={{ padding: 4, maxWidth: 220 }}>
                          <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 14, textTransform: "capitalize", marginBottom: 4 }}>
                            {need.category}
                          </h3>
                          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
                            {need.description}
                          </p>
                          <UrgencyBadge score={need.urgencyScore} />
                        </div>
                      </Popup>
                    </CircleMarker>
                  ) : null
                )}
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </VolunteerBottomNav>
  );
}
