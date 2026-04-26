import { useState, useEffect } from "react";
import { subscribeToOpenNeeds } from "../../services/needsService";
import VolunteerBottomNav from "../../components/layout/VolunteerBottomNav";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import UrgencyBadge from "../../components/common/UrgencyBadge";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [20.5937, 78.9629];

const getMarkerColor = (score) => {
  if (score >= 8) return "#EF4444";
  if (score >= 4) return "#F59E0B";
  return "#22C55E";
};

export default function VolunteerMapPage() {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div id="volunteer-map-page">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Nearby Needs</h1>
        <div className="bg-white rounded-2xl shadow-card overflow-hidden h-[60vh]">
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
              {needs.map((need) =>
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
                      <div className="p-1 max-w-xs">
                        <h3 className="font-bold text-sm capitalize mb-1">{need.category}</h3>
                        <p className="text-xs text-gray-600 mb-2">{need.description}</p>
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
    </VolunteerBottomNav>
  );
}
