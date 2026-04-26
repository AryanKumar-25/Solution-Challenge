import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addNeed } from "../../services/needsService";
import { scoreUrgency } from "../../ai/urgencyScorer";
import NGOSidebar from "../../components/layout/NGOSidebar";
import UrgencyBadge from "../../components/common/UrgencyBadge";
import {
  FileText, MapPin, Tag, Send, Loader2, ArrowLeft, Sparkles,
} from "lucide-react";

const CATEGORIES = [
  { value: "food", label: "🍲 Food" },
  { value: "medical", label: "🏥 Medical" },
  { value: "shelter", label: "🏠 Shelter" },
  { value: "education", label: "📚 Education" },
];

export default function SubmitNeedPage() {
  const [formData, setFormData] = useState({
    description: "",
    category: "food",
    locationName: "",
    lat: "",
    lng: "",
  });
  const [urgencyScore, setUrgencyScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-score when description changes
    if (field === "description" && value.length > 10) {
      const score = scoreUrgency(value);
      setUrgencyScore(score);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const score = scoreUrgency(formData.description);

      await addNeed({
        description: formData.description,
        category: formData.category,
        locationName: formData.locationName,
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
        urgencyScore: score,
        submittedByNGO: user?.uid || "unknown",
      });

      setSuccess(true);
      setTimeout(() => navigate("/ngo/dashboard"), 2000);
    } catch (err) {
      console.error("Failed to submit need:", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <NGOSidebar>
        <div className="max-w-2xl mx-auto text-center py-20 animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Need Submitted!</h2>
          <p className="text-gray-500 mb-2">
            The community need has been recorded with an urgency score of{" "}
            <span className="font-bold text-accent">{urgencyScore}</span>.
          </p>
          <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
        </div>
      </NGOSidebar>
    );
  }

  return (
    <NGOSidebar>
      <div className="max-w-2xl mx-auto" id="submit-need-page">
        {/* Header */}
        <button
          onClick={() => navigate("/ngo/dashboard")}
          className="btn-ghost mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Submit New Need Report</h1>
        <p className="text-gray-500 mb-8">
          Describe a community need and our AI will assess its urgency
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 lg:p-8 space-y-6">
          {/* Description */}
          <div>
            <label className="input-label" htmlFor="need-description">
              <FileText className="w-4 h-4 inline mr-1" />
              Description
            </label>
            <textarea
              id="need-description"
              className="input-field min-h-[120px] resize-y"
              placeholder="Describe the community need in detail..."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
            {/* Live urgency preview */}
            {urgencyScore !== null && (
              <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl animate-fade-in">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-sm text-gray-600">AI Urgency Score:</span>
                <UrgencyBadge score={urgencyScore} />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="input-label">
              <Tag className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => updateField("category", cat.value)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center
                    ${formData.category === cat.value
                      ? "border-primary bg-primary-50 text-primary"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="input-label" htmlFor="need-location">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location Name
            </label>
            <input
              id="need-location"
              type="text"
              className="input-field"
              placeholder="e.g., Dharavi, Mumbai"
              value={formData.locationName}
              onChange={(e) => updateField("locationName", e.target.value)}
              required
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label" htmlFor="need-lat">Latitude</label>
              <input
                id="need-lat"
                type="number"
                step="any"
                className="input-field"
                placeholder="19.076"
                value={formData.lat}
                onChange={(e) => updateField("lat", e.target.value)}
              />
            </div>
            <div>
              <label className="input-label" htmlFor="need-lng">Longitude</label>
              <input
                id="need-lng"
                type="number"
                step="any"
                className="input-field"
                placeholder="72.877"
                value={formData.lng}
                onChange={(e) => updateField("lng", e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full"
            id="submit-need-btn"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Need Report
              </>
            )}
          </button>
        </form>
      </div>
    </NGOSidebar>
  );
}
