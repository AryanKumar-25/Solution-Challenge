import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addNeed } from "../../services/needsService";
import { extractSurveyData } from "../../ai/surveyExtractor";
import NGOSidebar from "../../components/layout/NGOSidebar";
import UrgencyBadge from "../../components/common/UrgencyBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  Upload, FileImage, ArrowLeft, Loader2, CheckCircle, Edit3, Save, Sparkles,
} from "lucide-react";

export default function UploadSurveyPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExtractedData(null);
      setSaved(false);
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setExtracting(true);
    try {
      const data = await extractSurveyData(file);
      setExtractedData(data);
    } catch (err) {
      console.error("Extraction failed:", err);
    } finally {
      setExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData) return;
    setSaving(true);
    try {
      await addNeed({
        description: extractedData.description,
        category: extractedData.category,
        locationName: extractedData.locationName,
        lat: extractedData.suggestedLat || 0,
        lng: extractedData.suggestedLng || 0,
        urgencyScore: extractedData.urgencyScore,
        submittedByNGO: user?.uid || "unknown",
        source: "survey",
      });
      setSaved(true);
      setTimeout(() => navigate("/ngo/dashboard"), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setExtractedData((prev) => ({ ...prev, [field]: value }));
  };

  if (saved) {
    return (
      <NGOSidebar>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", padding: "80px 0", animation: "fadeUp 0.5s ease-out" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", background: "#E6F9EE",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
          }}>
            <CheckCircle size={36} color="#2DCB73" />
          </div>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "#1A1A2E", marginBottom: 8 }}>
            Survey Data Saved! 🎉
          </h2>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: "#6B7280" }}>
            Redirecting to dashboard...
          </p>
        </div>
      </NGOSidebar>
    );
  }

  return (
    <NGOSidebar>
      <div style={{ maxWidth: 740, margin: "0 auto" }} id="upload-survey-page">
        <button
          onClick={() => navigate("/ngo/dashboard")}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: "none",
            border: "none", cursor: "pointer", marginBottom: 16,
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 14, color: "#6B7280",
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 24, color: "#1A1A2E", marginBottom: 4 }}>
          Upload Paper Survey 📄
        </h1>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 400, fontSize: 15, color: "#6B7280", marginBottom: 32 }}>
          Upload a scanned survey and our AI will extract structured data
        </p>

        {/* Upload area */}
        <div style={{
          background: "white", borderRadius: 20, padding: 32,
          boxShadow: "0 4px 24px rgba(107,78,255,0.10)", marginBottom: 24,
        }}>
          <div
            style={{
              border: `2px dashed ${file ? "#6B4EFF" : "#D1D5DB"}`,
              borderRadius: 20, padding: 40, textAlign: "center",
              transition: "all 0.2s ease",
              background: file ? "rgba(107,78,255,0.03)" : "transparent",
            }}
          >
            {preview ? (
              <div style={{ marginBottom: 16 }}>
                <img src={preview} alt="Survey preview"
                  style={{ maxHeight: 260, margin: "0 auto", borderRadius: 16, boxShadow: "0 4px 24px rgba(107,78,255,0.15)" }} />
              </div>
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: 16, background: "#EDE9FF",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              }}>
                <FileImage size={28} color="#6B4EFF" />
              </div>
            )}
            <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 16, color: "#1A1A2E", marginBottom: 4 }}>
              {file ? file.name : "Drop a survey file here or click to upload"}
            </p>
            {file && (
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "#6B7280" }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            )}
            {!file && (
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                PDF, JPG, PNG supported
              </p>
            )}

            <label htmlFor="survey-file-input" className="btn-outline"
              style={{ marginTop: 16, display: "inline-flex", cursor: "pointer", fontSize: 14, padding: "8px 20px" }}>
              <Upload size={16} /> {file ? "Change File" : "Choose File"}
            </label>
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange}
              style={{ display: "none" }} id="survey-file-input" />
          </div>

          {file && !extractedData && (
            <button onClick={handleExtract} disabled={extracting} className="btn-accent"
              id="extract-survey-btn" style={{ width: "100%", marginTop: 24, height: 52, borderRadius: 12 }}>
              {extracting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with Gemini AI...</>
              ) : (
                <><Sparkles size={18} /> Extract Data with AI</>
              )}
            </button>
          )}
        </div>

        {extracting && (
          <div style={{ background: "white", borderRadius: 20, padding: 40, boxShadow: "0 4px 24px rgba(107,78,255,0.10)", textAlign: "center" }}>
            <LoadingSpinner size="lg" text="Analyzing survey with Gemini Vision AI..." />
          </div>
        )}

        {extractedData && !extracting && (
          <div style={{
            background: "white", borderRadius: 20, padding: 32,
            boxShadow: "0 4px 24px rgba(107,78,255,0.10)",
            animation: "fadeUp 0.4s ease-out",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} color="#FF6B35" />
                <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: "#1A1A2E" }}>
                  Extracted Results
                </h3>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 14, color: "#6B4EFF",
                }}
              >
                <Edit3 size={14} /> {editing ? "Done" : "Edit"}
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">Extracted Text</label>
              <div style={{
                background: "#F9FAFB", borderRadius: 14, padding: 16,
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "#1A1A2E",
                whiteSpace: "pre-wrap", maxHeight: 200, overflowY: "auto", lineHeight: 1.6,
              }}>
                {extractedData.rawText}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <label className="input-label">Category</label>
                {editing ? (
                  <select className="input-field" value={extractedData.category}
                    onChange={(e) => updateField("category", e.target.value)}>
                    <option value="food">🍱 Food</option>
                    <option value="medical">🏥 Medical</option>
                    <option value="shelter">🏠 Shelter</option>
                    <option value="education">📚 Education</option>
                  </select>
                ) : (
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 15, color: "#1A1A2E", textTransform: "capitalize" }}>
                    {extractedData.category}
                  </p>
                )}
              </div>
              <div>
                <label className="input-label">Urgency Score</label>
                {editing ? (
                  <input type="number" min="1" max="10" className="input-field" style={{ width: 80 }}
                    value={extractedData.urgencyScore}
                    onChange={(e) => updateField("urgencyScore", Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} />
                ) : (
                  <UrgencyBadge score={extractedData.urgencyScore} />
                )}
              </div>
              <div>
                <label className="input-label">Location</label>
                {editing ? (
                  <input type="text" className="input-field" value={extractedData.locationName}
                    onChange={(e) => updateField("locationName", e.target.value)} />
                ) : (
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500, fontSize: 15, color: "#1A1A2E" }}>
                    {extractedData.locationName}
                  </p>
                )}
              </div>
              <div>
                <label className="input-label">Description</label>
                {editing ? (
                  <textarea className="input-field" style={{ minHeight: 80, height: "auto" }} value={extractedData.description}
                    onChange={(e) => updateField("description", e.target.value)} />
                ) : (
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: "#6B7280" }}>
                    {extractedData.description}
                  </p>
                )}
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-accent"
              id="save-survey-btn" style={{ width: "100%", height: 52, borderRadius: 12 }}>
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save size={18} /> Confirm & Save to Dashboard</>}
            </button>
          </div>
        )}
      </div>
    </NGOSidebar>
  );
}
