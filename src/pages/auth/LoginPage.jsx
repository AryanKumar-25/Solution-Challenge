import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUpUser, signInUser } from "../../services/authService";
import { Heart, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

/* ── Sign In Illustration (two people high-fiving) ──── */
function SignInIllustration() {
  return (
    <svg viewBox="0 0 300 280" fill="none" style={{ width: "100%", maxWidth: 280 }}>
      {/* Ground */}
      <ellipse cx="150" cy="260" rx="120" ry="14" fill="rgba(255,255,255,0.15)" />
      {/* Person 1 */}
      <circle cx="100" cy="150" r="22" fill="#FDBCB4" stroke="#1A1A2E" strokeWidth="2"/>
      <rect x="82" y="172" width="36" height="50" rx="10" fill="#FF6B35" stroke="#1A1A2E" strokeWidth="2"/>
      <rect x="88" y="222" width="12" height="22" rx="5" fill="#1A1A2E"/>
      <rect x="104" y="222" width="12" height="22" rx="5" fill="#1A1A2E"/>
      <circle cx="93" cy="147" r="3" fill="#1A1A2E"/>
      <circle cx="107" cy="147" r="3" fill="#1A1A2E"/>
      <path d="M95 156C95 156 100 160 105 156" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Person 2 */}
      <circle cx="200" cy="150" r="22" fill="#C68642" stroke="#1A1A2E" strokeWidth="2"/>
      <rect x="182" y="172" width="36" height="50" rx="10" fill="#FFD046" stroke="#1A1A2E" strokeWidth="2"/>
      <rect x="188" y="222" width="12" height="22" rx="5" fill="#1A1A2E"/>
      <rect x="204" y="222" width="12" height="22" rx="5" fill="#1A1A2E"/>
      <circle cx="193" cy="147" r="3" fill="#1A1A2E"/>
      <circle cx="207" cy="147" r="3" fill="#1A1A2E"/>
      <path d="M195 156C195 156 200 160 205 156" stroke="#1A1A2E" strokeWidth="1.5" strokeLinecap="round"/>
      {/* High-five hands */}
      <rect x="118" y="180" width="28" height="7" rx="3.5" fill="#FDBCB4" stroke="#1A1A2E" strokeWidth="1.5" transform="rotate(-15 118 180)"/>
      <rect x="154" y="176" width="28" height="7" rx="3.5" fill="#C68642" stroke="#1A1A2E" strokeWidth="1.5" transform="rotate(15 154 176)"/>
      {/* Sparkle */}
      <path d="M150 130L152 136L158 137L152 139L150 145L148 139L142 137L148 136Z" fill="#FFD046" stroke="#1A1A2E" strokeWidth="1"/>
      <circle cx="130" cy="130" r="3" fill="white" opacity="0.5"/>
      <circle cx="170" cy="125" r="2" fill="white" opacity="0.4"/>
      {/* Stars */}
      <path d="M60 120L62 125L67 126L62 128L60 133L58 128L53 126L58 125Z" fill="white" opacity="0.3"/>
      <path d="M240 110L241 114L246 115L241 116L240 120L239 116L234 115L239 114Z" fill="white" opacity="0.25"/>
    </svg>
  );
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("ngo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpUser(email, password, role, displayName);
      } else {
        await signInUser(email, password);
      }

      // Navigation will be handled by AuthContext + ProtectedRoute
      // but we force-redirect based on expected role
      if (isSignUp) {
        if (role === "volunteer") {
          navigate("/signup/volunteer", { state: { email, uid: true } });
          return;
        }
        navigate("/ngo/dashboard");
      } else {
        // After login, the onAuthStateChanged will determine role
        // For now redirect to a neutral place and let ProtectedRoute handle it
        navigate("/ngo/dashboard");
      }
    } catch (err) {
      const code = err.code || "";
      const messages = {
        "auth/email-already-in-use": "This email is already registered. Please sign in instead.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Invalid email or password. Please try again.",
        "auth/too-many-requests": "Too many failed attempts. Please try again later.",
        "auth/operation-not-allowed": "Email/password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.",
        "auth/network-request-failed": "Network error. Please check your internet connection.",
      };
      setError(messages[code] || err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }} id="login-page">
      {/* ── Left panel — illustrated ── */}
      <div
        style={{
          width: "45%",
          background: "#6B4EFF",
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
        {/* Scattered doodles */}
        <svg style={{ position: "absolute", top: "10%", left: "8%", opacity: 0.15 }} width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 1L12 7L18 8L12 10L10 16L8 10L2 8L8 7Z" fill="white"/>
        </svg>
        <svg style={{ position: "absolute", bottom: "15%", right: "12%", opacity: 0.12 }} width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="3" fill="white"/>
        </svg>
        <svg style={{ position: "absolute", top: "55%", left: "15%", opacity: 0.1 }} width="10" height="10" viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="4" fill="white"/>
        </svg>
        <svg style={{ position: "absolute", top: "30%", right: "20%", opacity: 0.1 }} width="14" height="14" viewBox="0 0 14 14">
          <path d="M7 1L8.5 5L13 6L8.5 7.5L7 11L5.5 7.5L1 6L5.5 5Z" fill="white"/>
        </svg>

        <div style={{ animation: "float 4s ease-in-out infinite" }}>
          <SignInIllustration />
        </div>

        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 28,
          color: "white", marginTop: 24, textAlign: "center",
        }}>
          Together we can do more.
        </h2>

        <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {["✓ Free to join", "✓ AI matching", "✓ Real impact"].map((badge) => (
            <span
              key={badge}
              style={{
                padding: "6px 16px", borderRadius: 999, background: "rgba(255,255,255,0.15)",
                color: "white", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500,
                fontSize: 13, backdropFilter: "blur(8px)",
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
        }}
      >
        <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.5s ease-out" }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#6B4EFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={20} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 20, color: "#6B4EFF" }}>
              VolunteerBridge
            </span>
          </div>

          {/* Desktop small logo */}
          <div className="hidden lg:flex" style={{ alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#6B4EFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={16} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 16, color: "#6B4EFF" }}>
              VolunteerBridge
            </span>
          </div>

          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 32, color: "#1A1A2E", marginBottom: 4 }}>
            {isSignUp ? "Create your account ✨" : "Welcome back 👋"}
          </h2>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 15, color: "#6B7280", marginBottom: 32 }}>
            {isSignUp ? "Join the volunteer coordination platform" : "Sign in and start making a difference"}
          </p>

          {error && (
            <div style={{
              marginBottom: 24, padding: 14, background: "#FFE8F2", border: "1.5px solid #FF4D8D",
              borderRadius: 12, color: "#1A1A2E", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {isSignUp && (
              <div>
                <label className="input-label" htmlFor="displayName">Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={18} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    id="displayName"
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: 42 }}
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="input-label" htmlFor="email">Email</label>
              <div style={{ position: "relative" }}>
                <Mail size={18} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: 42 }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={18} color="#9CA3AF" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  style={{ paddingLeft: 42, paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 4,
                    color: "#9CA3AF", display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isSignUp && (
                <div style={{ textAlign: "right", marginTop: 6 }}>
                  <button type="button" style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 13,
                    color: "#6B4EFF",
                  }}>
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="input-label">I am a...</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setRole("ngo")}
                    style={{
                      padding: 16, borderRadius: 16, textAlign: "center", cursor: "pointer",
                      border: `2px solid ${role === "ngo" ? "#6B4EFF" : "#E5E7EB"}`,
                      background: role === "ngo" ? "#EDE9FF" : "white",
                      transition: "all 0.2s ease", position: "relative",
                    }}
                  >
                    {role === "ngo" && (
                      <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 99, background: "#6B4EFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                      </div>
                    )}
                    <div style={{ fontSize: 28, marginBottom: 4 }}>🏢</div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E" }}>NGO / Coordinator</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 12, color: "#6B7280", marginTop: 2 }}>Post needs & assign volunteers</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("volunteer")}
                    style={{
                      padding: 16, borderRadius: 16, textAlign: "center", cursor: "pointer",
                      border: `2px solid ${role === "volunteer" ? "#FF6B35" : "#E5E7EB"}`,
                      background: role === "volunteer" ? "#FFF0EA" : "white",
                      transition: "all 0.2s ease", position: "relative",
                    }}
                  >
                    {role === "volunteer" && (
                      <div style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 99, background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                      </div>
                    )}
                    <div style={{ fontSize: 28, marginBottom: 4 }}>🙋</div>
                    <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E" }}>Volunteer</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 12, color: "#6B7280", marginTop: 2 }}>Find & accept tasks near you</div>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              id="login-submit-btn"
              style={{ width: "100%", height: 52, borderRadius: 12 }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 14,
                color: "#6B4EFF",
              }}
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign Up"}
            </button>
          </div>

          {!isSignUp && (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Link
                to="/signup/volunteer"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 14,
                  color: "#FF6B35", textDecoration: "none",
                }}
              >
                Register as a Volunteer →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
