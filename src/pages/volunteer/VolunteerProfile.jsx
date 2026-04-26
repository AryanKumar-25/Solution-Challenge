import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { subscribeToVolunteerProfile, toggleAvailability, updateVolunteerProfile } from "../../services/volunteersService";
import VolunteerBottomNav from "../../components/layout/VolunteerBottomNav";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { User, CheckCircle, XCircle, Award, ClipboardCheck, Edit3, Save, Loader2 } from "lucide-react";

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

  return (
    <VolunteerBottomNav>
      <div id="volunteer-profile">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {profile?.name?.[0]?.toUpperCase() || "V"}
              </span>
            </div>
            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  className="input-field !py-2 text-lg font-bold"
                  value={editData.name || ""}
                  onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))}
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
              )}
              <p className="text-gray-500 text-sm">{profile?.email}</p>
            </div>
            <button onClick={() => setEditing(!editing)} className="btn-ghost text-sm">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
            <div>
              <p className="font-medium text-gray-900">Availability</p>
              <p className="text-sm text-gray-500">
                {profile?.isAvailable ? "You're available for tasks" : "Currently unavailable"}
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                profile?.isAvailable ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${
                  profile?.isAvailable ? "translate-x-7" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="input-label">Location</label>
            {editing ? (
              <input
                type="text"
                className="input-field"
                value={editData.locationName || ""}
                onChange={(e) => setEditData((p) => ({ ...p, locationName: e.target.value }))}
              />
            ) : (
              <p className="text-gray-700">{profile?.locationName || "Not set"}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="input-label">Skills</label>
            {editing ? (
              <div className="grid grid-cols-2 gap-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill.value}
                    type="button"
                    onClick={() => toggleSkill(skill.value)}
                    className={`p-2 rounded-lg border text-sm text-left transition-all ${
                      editData.skills?.includes(skill.value)
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {skill.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.map((skill) => (
                  <span key={skill} className="badge bg-primary-50 text-primary border border-primary-100 capitalize">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {editing && (
            <button onClick={handleSave} disabled={saving} className="btn-accent w-full mt-6">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Accepted</p>
                <p className="text-2xl font-bold">{profile?.tasksAccepted || 0}</p>
              </div>
            </div>
          </div>
          <div className="stat-card" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.9), rgba(22,163,74,0.9))" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">Completed</p>
                <p className="text-2xl font-bold">{profile?.tasksCompleted || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VolunteerBottomNav>
  );
}
