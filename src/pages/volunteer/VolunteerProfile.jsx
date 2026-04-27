import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { subscribeToVolunteerProfile, toggleAvailability, updateVolunteerProfile } from "../../services/volunteersService";
import VolunteerBottomNav from "../../components/layout/VolunteerBottomNav";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { User, Award, ClipboardCheck, Edit3, Save, Loader2, MapPin } from "lucide-react";

const SKILL_OPTIONS = [
  { value: "first aid", label: "🩹 First Aid" },
  { value: "food distribution", label: "🍲 Food Distribution" },
  { value: "teaching", label: "📚 Teaching" },
  { value: "logistics", label: "📦 Logistics" },
  { value: "medical", label: "🏥 Medical" },
  { value: "counseling", label: "💬 Counseling" },
];

export default function VolunteerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToVolunteerProfile(user.uid, (data) => {
      setProfile(data);
      setEditData(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleToggle = async () => {
    if (!profile) return;
    await toggleAvailability(user.uid, !profile.isAvailable);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateVolunteerProfile(user.uid, {
        name: editData.name,
        locationName: editData.locationName,
        skills: editData.skills,
      });
      setEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (skill) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills?.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...(prev.skills || []), skill],
    }));
  };

  if (loading) {
    return (
      <VolunteerBottomNav>
        <LoadingSpinner text="Loading profile..." />
      </VolunteerBottomNav>
    );
  }

  const initials = profile?.name?.[0]?.toUpperCase() || "V";

  return (
    <VolunteerBottomNav>
      <div id="volunteer-profile" style={{ animation: "fadeUp 0.35s ease-out" }}>
        {/* ── Profile Header with gradient ── */}
        <div style={{
          background: "linear-gradient(135deg, #6B4EFF 0%, #8B72FF 100%)",
          borderRadius: 24,
          padding: "32px 24px 40px",
          marginBottom: -32,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -10, left: -10, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "#FF6B35", border: "4px solid white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 28, color: "white",
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              {editing ? (
                <input
                  type="text"
                  className="input-field"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", fontWeight: 800, fontSize: 20, fontFamily: "'Nunito', sans-serif" }}
                  value={editData.name || ""}
                  onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                />
              ) : (
                <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 22, color: "white" }}>
                  {profile?.name}
                </h2>
              )}
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {profile?.email}
              </p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10,
                padding: 8, cursor: "pointer", color: "white", display: "flex",
              }}
            >
              <Edit3 size={18} />
            </button>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 8px", marginBottom: 16, position: "relative", zIndex: 1 }}>
          <div style={{
            background: "white", borderRadius: 16, padding: 20,
            boxShadow: "0 4px 24px rgba(107,78,255,0.10)",
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 32, color: "#6B4EFF" }}>
              {profile?.tasksAccepted || 0}
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 13, color: "#6B7280", marginTop: 2 }}>
              Tasks Accepted
            </div>
          </div>
          <div style={{
            background: "white", borderRadius: 16, padding: 20,
            boxShadow: "0 4px 24px rgba(107,78,255,0.10)",
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 32, color: "#2DCB73" }}>
              {profile?.tasksCompleted || 0}
            </div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 13, color: "#6B7280", marginTop: 2 }}>
              Completed
            </div>
          </div>
        </div>

        {/* ── Details Card ── */}
        <div style={{
          background: "white", borderRadius: 20, padding: 24,
          boxShadow: "0 4px 24px rgba(107,78,255,0.10)",
        }}>
          {/* Availability toggle */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: 16, background: "#F9FAFB", borderRadius: 14, marginBottom: 20,
          }}>
            <div>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1A2E" }}>
                Availability
              </p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "#6B7280" }}>
                {profile?.isAvailable ? "You're available for tasks" : "Currently unavailable"}
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`toggle-switch ${profile?.isAvailable ? "active" : ""}`}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1A2E", display: "block", marginBottom: 6 }}>
              Location
            </label>
            {editing ? (
              <input
                type="text"
                className="input-field"
                value={editData.locationName || ""}
                onChange={(e) => setEditData((p) => ({ ...p, locationName: e.target.value }))}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={16} color="#6B4EFF" />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 15, color: "#1A1A2E" }}>
                  {profile?.locationName || "Not set"}
                </span>
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <label style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1A2E", display: "block", marginBottom: 8 }}>
              Skills
            </label>
            {editing ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill.value}
                    type="button"
                    onClick={() => toggleSkill(skill.value)}
                    style={{
                      padding: "6px 14px", borderRadius: 999, cursor: "pointer",
                      border: editData.skills?.includes(skill.value) ? "2px solid #6B4EFF" : "2px solid #E5E7EB",
                      background: editData.skills?.includes(skill.value) ? "#6B4EFF" : "white",
                      color: editData.skills?.includes(skill.value) ? "white" : "#1A1A2E",
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 13,
                      transition: "all 0.15s ease",
                    }}
                  >
                    {skill.label}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {profile?.skills?.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "5px 14px", borderRadius: 999,
                      background: "#EDE9FF", border: "1.5px solid #D9D1FF",
                      color: "#6B4EFF",
                      fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13,
                      textTransform: "capitalize",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-accent"
              style={{ width: "100%", marginTop: 24, height: 48, borderRadius: 12 }}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Save Changes</>}
            </button>
          )}
        </div>
      </div>
    </VolunteerBottomNav>
  );
}
