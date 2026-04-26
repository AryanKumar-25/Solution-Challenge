import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../../services/authService";
import { createVolunteerProfile } from "../../services/volunteersService";
import {
  Heart, Mail, Lock, User, MapPin, Loader2, ArrowRight, ArrowLeft, CheckCircle,
} from "lucide-react";

const SKILL_OPTIONS = [
  { value: "first aid", label: "🩹 First Aid" },
  { value: "food distribution", label: "🍲 Food Distribution" },
  { value: "teaching", label: "📚 Teaching" },
  { value: "logistics", label: "📦 Logistics" },
  { value: "medical", label: "🏥 Medical" },
  { value: "counseling", label: "💬 Counseling" },
];

export default function VolunteerSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: [],
    locationName: "",
    lat: "",
    lng: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create Firebase Auth user + user doc
      const user = await signUpUser(
        formData.email,
        formData.password,
        "volunteer",
        formData.name
      );

      // Create volunteer profile
      await createVolunteerProfile(user.uid, {
        name: formData.name,
        email: formData.email,
        skills: formData.skills,
        locationName: formData.locationName,
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
      });

      navigate("/volunteer/home");
    } catch (err) {
      const code = err.code || "";
      const messages = {
        "auth/email-already-in-use": "This email is already registered. Please sign in instead.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/operation-not-allowed": "Email/password sign-up is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.",
        "auth/network-request-failed": "Network error. Please check your internet connection.",
      };
      setError(messages[code] || err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4" id="volunteer-signup-page">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join as Volunteer</h1>
          <p className="text-gray-500 mt-1">Help your community make a difference</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-10 bg-accent"
                  : s < step
                  ? "w-10 bg-primary"
                  : "w-10 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 lg:p-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-semibold text-lg text-gray-900">Basic Information</h3>

              <div>
                <label className="input-label" htmlFor="vol-name">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="vol-name"
                    type="text"
                    className="input-field !pl-11"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="vol-email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="vol-email"
                    type="email"
                    className="input-field !pl-11"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="vol-password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="vol-password"
                    type="password"
                    className="input-field !pl-11"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (formData.name && formData.email && formData.password.length >= 6) {
                    setStep(2);
                  }
                }}
                className="btn-primary w-full"
              >
                Next: Skills
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-semibold text-lg text-gray-900">Your Skills</h3>
              <p className="text-sm text-gray-500">Select all skills that apply</p>

              <div className="grid grid-cols-2 gap-3">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill.value}
                    type="button"
                    onClick={() => toggleSkill(skill.value)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-left
                      ${formData.skills.includes(skill.value)
                        ? "border-primary bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {formData.skills.includes(skill.value) && (
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">{skill.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-ghost flex-1 border border-gray-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (formData.skills.length > 0) setStep(3);
                  }}
                  className="btn-primary flex-1"
                >
                  Next: Location
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-semibold text-lg text-gray-900">Your Location</h3>

              <div>
                <label className="input-label" htmlFor="vol-location">Location Name</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="vol-location"
                    type="text"
                    className="input-field !pl-11"
                    placeholder="e.g., Mumbai, Maharashtra"
                    value={formData.locationName}
                    onChange={(e) => updateField("locationName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label" htmlFor="vol-lat">Latitude</label>
                  <input
                    id="vol-lat"
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="19.076"
                    value={formData.lat}
                    onChange={(e) => updateField("lat", e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="vol-lng">Longitude</label>
                  <input
                    id="vol-lng"
                    type="number"
                    step="any"
                    className="input-field"
                    placeholder="72.877"
                    value={formData.lng}
                    onChange={(e) => updateField("lng", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-ghost flex-1 border border-gray-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent flex-1"
                  id="volunteer-signup-submit"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-primary font-medium hover:underline"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
