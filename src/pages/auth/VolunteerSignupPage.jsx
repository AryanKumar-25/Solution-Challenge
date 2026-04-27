import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../../services/authService";
import { createVolunteerProfile } from "../../services/volunteersService";
import {
  Heart, Mail, Lock, User, MapPin, Loader2, ArrowRight, ArrowLeft, CheckCircle, Eye, EyeOff, Phone,
} from "lucide-react";

const SKILL_OPTIONS = [
  { value: "food distribution", label: "🍲 Food Distribution" },
  { value: "medical", label: "🏥 Medical" },
  { value: "teaching", label: "📚 Education" },
  { value: "logistics", label: "📦 Transport" },
  { value: "shelter", label: "🏠 Shelter" },
  { value: "first aid", label: "🩹 First Aid" },
  { value: "counseling", label: "💬 Others" },
];

/* ── Signup Illustration ──────────────────────────────── */
function SignUpIllustration() {
  return (
    <svg viewBox="0 0 300 280" fill="none" style={{ width: "100%", maxWidth: 260 }}>
      <ellipse cx="150" cy="260" rx="120" ry="14" fill="rgba(255,255,255,0.15)" />
      {/* Tree */}
      <rect x="140" y="180" width="20" height="60" rx="4" fill="#8D5524" stroke="#1A1A2E" strokeWidth="2"/>
      <circle cx="150" cy="150" r="50" fill="#2DCB73" stroke="#1A1A2E" strokeWidth="2"/>
      <circle cx="130" cy="135" r="20" fill="#26B866" stroke="#1A1A2E" strokeWidth="1.5"/>
      <circle cx="170" cy="140" r="18" fill="#26B866" stroke="#1A1A2E" strokeWidth="1.5"/>
      {/* Person 1 planting */}
      <circle cx="80" cy="210" r="16" fill="#FDBCB4" stroke="#1A1A2E" strokeWidth="2"/>
      <rect x="66" y="226" width="28" height="36" rx="8" fill="#6B4EFF" stroke="#1A1A2E" strokeWidth="2"/>
      <rect x="72" y="262" width="9" height="16" rx="4" fill="#1A1A2E"/>
      <rect x="85" y="262" width="9" height="16" rx="4" fill="#1A1A2E"/>
      <circle cx="75" cy="207" r="2.5" fill="#1A1A2E"/>
      <circle cx="85" cy="207" r="2.5" fill="#1A1A2E"/>
      <path d="M76 215C76 215 80 218 84 215" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Arm reaching to tree */}
      <rect x="94" y="236" width="24" height="5" rx="2.5" fill="#FDBCB4" stroke="#1A1A2E" strokeWidth="1"/>
      {/* Person 2 */}
      <circle cx="220" cy="210" r="16" fill="#C68642" stroke="#1A1A2E" strokeWidth="2"/>
      <rect x="206" y="226" width="28" height="36" rx="8" fill="#FFD046" stroke="#1A1A2E" strokeWidth="2"/>
      <rect x="212" y="262" width="9" height="16" rx="4" fill="#1A1A2E"/>
      <rect x="225" y="262" width="9" height="16" rx="4" fill="#1A1A2E"/>
      <circle cx="215" cy="207" r="2.5" fill="#1A1A2E"/>
      <circle cx="225" cy="207" r="2.5" fill="#1A1A2E"/>
      <path d="M216 215C216 215 220 218 224 215" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Carrying box */}
      <rect x="190" y="230" width="16" height="14" rx="3" fill="#FF6B35" stroke="#1A1A2E" strokeWidth="1.5"/>
      {/* Sparkles */}
      <path d="M150 100L152 106L158 107L152 109L150 115L148 109L142 107L148 106Z" fill="#FFD046" stroke="#1A1A2E" strokeWidth="1"/>
      <circle cx="200" cy="170" r="3" fill="white" opacity="0.4"/>
      <circle cx="100" cy="175" r="2" fill="white" opacity="0.3"/>
    </svg>
  );
}

export default function VolunteerSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    skills: [],
    locationName: "",
    lat: "",
    lng: "",
    isAvailable: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

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

  // Progress bar based on filled fields
  const filledCount = [
    formData.name, formData.email, formData.password,
    formData.skills.length > 0 ? "x" : "", formData.locationName,
  ].filter(Boolean).length;
  const progress = Math.round((filledCount / 5) * 100);

  return (
    <div style={{ minHeight: "100vh", display: "flex" }} id="volunteer-signup-page">
      {/* ── Left panel — illustrated ── */}
      <div
        style={{
          width: "45%",
          background: "#FF6B35",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
        className="hidden lg:flex"
      >
        {/* Doodles */}
        <svg style={{ position: "absolute", top: "12%", left: "10%", opacity: 0.15 }} width="18" height="18" viewBox="0 0 18 18">
          <path d="M9 1L11 6L17 7L11 9L9 14L7 9L1 7L7 6Z" fill="white"/>
        </svg>
        <svg style={{ position: "absolute", bottom: "20%", right: "15%", opacity: 0.1 }} width="14" height="14" viewBox="0 0 14 14">
          <circle cx="7" cy="7" r="5" fill="white"/>
        </svg>
        <svg style={{ position: "absolute", top: "50%", right: "25%", opacity: 0.08 }} width="12" height="12" viewBox="0 0 12 12">
          <circle cx="6" cy="6" r="4" fill="white"/>
        </svg>

        <div style={{ animation: "float 4s ease-in-out infinite" }}>
          <SignUpIllustration />
        </div>

        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 28,
          color: "white", marginTop: 24, textAlign: "center",
        }}>
          Be the change you wish to see.
        </h2>

        <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {["✓ Quick setup", "✓ Skills matching", "✓ Nearby tasks"].map((badge) => (
            <span
              key={badge}
              style={{
                padding: "6px 16px", borderRadius: 999, background: "rgba(255,255,255,0.2)",
                color: "white", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500,
                fontSize: 13,
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "white",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 480, animation: "fadeUp 0.5s ease-out" }}>
          {/* Progress bar */}
          <div style={{ height: 4, background: "#EDE9FF", borderRadius: 2, marginBottom: 32, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#6B4EFF", borderRadius: 2, width: `${progress}%`, transition: "width 0.3s ease" }} />
          </div>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={16} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, color: "#FF6B35" }}>VolunteerBridge</span>
          </div>

          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28, color: "#1A1A2E", marginBottom: 4 }}>
            Join as Volunteer 🙋
          </h2>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 15, color: "#6B7280", marginBottom: 28 }}>
            Help your community make a difference
          </p>

          {/* Step indicators */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  height: 6, borderRadius: 3, flex: 1,
                  background: s <= step ? (s === step ? "#FF6B35" : "#6B4EFF") : "#E5E7EB",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {error && (
            <div style={{
              marginBottom: 20, padding: 14, background: "#FFE8F2", border: "1.5px solid #FF4D8D",
              borderRadius: 12, color: "#1A1A2E", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp 0.3s ease-out" }}>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A1A2E" }}>Basic Information</h3>

                <div>
                  <label className="input-label" htmlFor="vol-name">Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={18} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input id="vol-name" type="text" className="input-field" style={{ paddingLeft: 42 }}
                      placeholder="Your full name" value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="input-label" htmlFor="vol-email">Email</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={18} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input id="vol-email" type="email" className="input-field" style={{ paddingLeft: 42 }}
                      placeholder="you@example.com" value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="input-label" htmlFor="vol-phone">Mobile Number</label>
                  <div style={{ position: "relative", display: "flex" }}>
                    <div style={{
                      position: "absolute", left: 1, top: 1, bottom: 1,
                      display: "flex", alignItems: "center", padding: "0 12px",
                      background: "#F3F4F6", borderRadius: "11px 0 0 11px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 500,
                      color: "#1A1A2E", borderRight: "1px solid #E5E7EB",
                    }}>
                      +91
                    </div>
                    <input id="vol-phone" type="tel" className="input-field" style={{ paddingLeft: 72 }}
                      placeholder="9876543210" value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="input-label" htmlFor="vol-password">Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={18} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input id="vol-password" type={showPassword ? "text" : "password"} className="input-field"
                      style={{ paddingLeft: 42, paddingRight: 44 }}
                      placeholder="Min 6 characters" value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)} required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="input-label" htmlFor="vol-confirm">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={18} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input id="vol-confirm" type={showConfirmPassword ? "text" : "password"} className="input-field"
                      style={{ paddingLeft: 42, paddingRight: 44 }}
                      placeholder="Confirm password" value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)} required minLength={6} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex" }}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4, animation: "fadeUp 0.2s ease-out" }}>
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle size={14} color="#2DCB73" />
                          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#2DCB73", fontWeight: 500 }}>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: 14, color: "#FF4D8D" }}>✗</span>
                          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: "#FF4D8D", fontWeight: 500 }}>Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (formData.name && formData.email && formData.password.length >= 6) {
                      if (formData.password !== formData.confirmPassword) {
                        setError("Passwords don't match.");
                        return;
                      }
                      setError("");
                      setStep(2);
                    }
                  }}
                  className="btn-accent"
                  style={{ width: "100%", height: 52, borderRadius: 12 }}
                >
                  Next: Skills <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp 0.3s ease-out" }}>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A1A2E" }}>Your Skills</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "#6B7280" }}>
                  Select all skills that apply
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {SKILL_OPTIONS.map((skill) => (
                    <button
                      key={skill.value}
                      type="button"
                      onClick={() => toggleSkill(skill.value)}
                      style={{
                        padding: "8px 18px", borderRadius: 999, cursor: "pointer",
                        border: formData.skills.includes(skill.value) ? "2px solid #6B4EFF" : "2px solid #E5E7EB",
                        background: formData.skills.includes(skill.value) ? "#6B4EFF" : "white",
                        color: formData.skills.includes(skill.value) ? "white" : "#1A1A2E",
                        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 14,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>

                {/* Availability */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#F9FAFB", borderRadius: 12, marginTop: 8 }}>
                  <div>
                    <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E" }}>Available now?</p>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "#6B7280" }}>
                      You can change this later
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateField("isAvailable", !formData.isAvailable)}
                    className={`toggle-switch ${formData.isAvailable ? "active" : ""}`}
                  >
                    <div className="toggle-thumb" />
                  </button>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost"
                    style={{ flex: 1, border: "1.5px solid #E5E7EB", height: 48, borderRadius: 12 }}>
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="button" onClick={() => { if (formData.skills.length > 0) setStep(3); }}
                    className="btn-accent" style={{ flex: 1, height: 48, borderRadius: 12 }}>
                    Next: Location <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp 0.3s ease-out" }}>
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A1A2E" }}>Your Location</h3>

                <div>
                  <label className="input-label" htmlFor="vol-location">City / Area</label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={18} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input id="vol-location" type="text" className="input-field" style={{ paddingLeft: 42 }}
                      placeholder="e.g., Mumbai, Maharashtra" value={formData.locationName}
                      onChange={(e) => updateField("locationName", e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label className="input-label" htmlFor="vol-lat">Latitude</label>
                    <input id="vol-lat" type="number" step="any" className="input-field"
                      placeholder="19.076" value={formData.lat}
                      onChange={(e) => updateField("lat", e.target.value)} />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="vol-lng">Longitude</label>
                    <input id="vol-lng" type="number" step="any" className="input-field"
                      placeholder="72.877" value={formData.lng}
                      onChange={(e) => updateField("lng", e.target.value)} />
                  </div>
                </div>

                {/* Terms */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" required style={{ marginTop: 3, accentColor: "#6B4EFF", width: 16, height: 16 }} />
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "#6B7280" }}>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>

                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" onClick={() => setStep(2)} className="btn-ghost"
                    style={{ flex: 1, border: "1.5px solid #E5E7EB", height: 48, borderRadius: 12 }}>
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="submit" disabled={loading} className="btn-accent"
                    id="volunteer-signup-submit"
                    style={{ flex: 1, height: 48, borderRadius: 12 }}>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Create Account <ArrowRight size={18} /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 14,
                color: "#6B4EFF",
              }}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
