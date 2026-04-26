import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUpUser, signInUser } from "../../services/authService";
import { Heart, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("ngo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen flex" id="login-page">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden items-center justify-center p-12">
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/5 blur-xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-2xl" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            VolunteerBridge
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Connecting NGOs with volunteers through intelligent matching. 
            Prioritize community needs and coordinate impact efficiently.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-bold text-accent">AI</div>
              <div className="text-white/60 text-xs mt-1">Smart Scoring</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-bold text-accent">📍</div>
              <div className="text-white/60 text-xs mt-1">Map Tracking</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-3xl font-bold text-accent">🤝</div>
              <div className="text-white/60 text-xs mt-1">Auto Match</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-50">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-primary">VolunteerBridge</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-gray-500 mb-8">
            {isSignUp
              ? "Join the volunteer coordination platform"
              : "Sign in to your dashboard"}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="input-label" htmlFor="displayName">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="displayName"
                    type="text"
                    className="input-field !pl-11"
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
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  className="input-field !pl-11"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  className="input-field !pl-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="input-label">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("ngo")}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center
                      ${role === "ngo"
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    <div className="text-2xl mb-1">🏢</div>
                    <div className="text-sm font-semibold">NGO Coordinator</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("volunteer")}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-center
                      ${role === "volunteer"
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    <div className="text-2xl mb-1">🙋</div>
                    <div className="text-sm font-semibold">Volunteer</div>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              id="login-submit-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-sm text-primary font-medium hover:underline"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-4 text-center">
              <Link
                to="/signup/volunteer"
                className="text-sm text-accent font-medium hover:underline"
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
