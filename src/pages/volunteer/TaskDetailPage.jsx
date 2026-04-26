import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getNeedById, updateNeed } from "../../services/needsService";
import { getTaskById, completeTask } from "../../services/tasksService";
import { incrementTasksCompleted } from "../../services/volunteersService";
import VolunteerBottomNav from "../../components/layout/VolunteerBottomNav";
import UrgencyBadge from "../../components/common/UrgencyBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft, MapPin, User, CheckCircle, Phone, Mail, Loader2 } from "lucide-react";

// Fix default Leaflet marker icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function TaskDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [need, setNeed] = useState(location.state?.need || null);
  const [task, setTask] = useState(location.state?.task || null);
  const [loading, setLoading] = useState(!need && !task);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (task && !need) {
        const needData = await getNeedById(task.needId);
        setNeed(needData);
      } else if (!task && !need) {
        const taskData = await getTaskById(id);
        if (taskData) {
          setTask(taskData);
          const needData = await getNeedById(taskData.needId);
          setNeed(needData);
        } else {
          const needData = await getNeedById(id);
          setNeed(needData);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      if (task) {
        await completeTask(task.id);
        await incrementTasksCompleted(user.uid);
        await updateNeed(task.needId, { status: "resolved" });
      }
      setCompleted(true);
      setTimeout(() => navigate("/volunteer/home"), 2000);
    } catch (err) {
      console.error("Complete failed:", err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <VolunteerBottomNav>
        <LoadingSpinner text="Loading task details..." />
      </VolunteerBottomNav>
    );
  }

  if (completed) {
    return (
      <VolunteerBottomNav>
        <div className="text-center py-20 animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Completed!</h2>
          <p className="text-gray-500">Great work! Redirecting...</p>
        </div>
      </VolunteerBottomNav>
    );
  }

  const categoryIcons = { food: "🍲", medical: "🏥", shelter: "🏠", education: "📚" };

  return (
    <VolunteerBottomNav>
      <div id="task-detail-page">
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Need details card */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{categoryIcons[need?.category] || "📋"}</span>
              <h2 className="text-xl font-bold text-gray-900 capitalize">{need?.category} Need</h2>
            </div>
            <UrgencyBadge score={need?.urgencyScore || 5} />
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">{need?.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {need?.locationName || "Unknown"}
            </span>
            {task?.status && (
              <span className={`badge ${
                task.status === "accepted" ? "bg-blue-100 text-blue-700" :
                task.status === "done" ? "bg-green-100 text-green-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>{task.status}</span>
            )}
          </div>
        </div>

        {/* Map */}
        {need?.lat && need?.lng && (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4 h-48">
            <MapContainer
              center={[need.lat, need.lng]}
              zoom={14}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[need.lat, need.lng]} icon={defaultIcon}>
                <Popup>{need.locationName}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* NGO Contact */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" /> NGO Contact
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> ngo@volunteerbridge.org</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</p>
          </div>
        </div>

        {/* Complete button */}
        {task && task.status === "accepted" && (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="btn-accent w-full"
            id="complete-task-btn"
          >
            {completing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <><CheckCircle className="w-5 h-5" /> Mark as Complete</>
            )}
          </button>
        )}
      </div>
    </VolunteerBottomNav>
  );
}
