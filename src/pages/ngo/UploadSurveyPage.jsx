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
        <div className="max-w-2xl mx-auto text-center py-20 animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Survey Data Saved!</h2>
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      </NGOSidebar>
    );
  }

  return (
    <NGOSidebar>
      <div className="max-w-3xl mx-auto" id="upload-survey-page">
        <button onClick={() => navigate("/ngo/dashboard")} className="btn-ghost mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Upload Paper Survey</h1>
        <p className="text-gray-500 mb-8">Upload a scanned survey and our AI will extract structured data</p>

        {/* Upload area */}
        <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8 mb-6">
          <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${file ? "border-primary bg-primary-50/30" : "border-gray-300 hover:border-primary/50"}`}>
            {preview ? (
              <div className="mb-4">
                <img src={preview} alt="Survey preview" className="max-h-64 mx-auto rounded-xl shadow-md" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileImage className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <p className="font-medium text-gray-700 mb-1">
              {file ? file.name : "Drop a survey file here or click to upload"}
            </p>
            {file && <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>}
            {!file && <p className="text-sm text-gray-400">PDF, JPG, PNG supported</p>}

            <label htmlFor="survey-file-input" className="btn-outline text-sm mt-4 cursor-pointer inline-flex">
              <Upload className="w-4 h-4" /> {file ? "Change File" : "Choose File"}
            </label>
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange}
              className="hidden" id="survey-file-input" />
          </div>

          {file && !extractedData && (
            <button onClick={handleExtract} disabled={extracting} className="btn-accent w-full mt-6" id="extract-survey-btn">
              {extracting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with Gemini AI...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Extract Data with AI</>
              )}
            </button>
          )}
        </div>

        {extracting && (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <LoadingSpinner size="lg" text="Analyzing survey with Gemini Vision AI..." />
          </div>
        )}

        {extractedData && !extracting && (
          <div className="bg-white rounded-2xl shadow-card p-6 lg:p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-lg text-gray-900">Extracted Results</h3>
              </div>
              <button onClick={() => setEditing(!editing)} className="btn-ghost text-sm">
                <Edit3 className="w-4 h-4" /> {editing ? "Done" : "Edit"}
              </button>
            </div>

            <div className="mb-6">
              <label className="input-label">Extracted Text</label>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {extractedData.rawText}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="input-label">Category</label>
                {editing ? (
                  <select className="input-field" value={extractedData.category}
                    onChange={(e) => updateField("category", e.target.value)}>
                    <option value="food">🍲 Food</option>
                    <option value="medical">🏥 Medical</option>
                    <option value="shelter">🏠 Shelter</option>
                    <option value="education">📚 Education</option>
                  </select>
                ) : (
                  <p className="text-gray-900 font-medium capitalize">{extractedData.category}</p>
                )}
              </div>
              <div>
                <label className="input-label">Urgency Score</label>
                {editing ? (
                  <input type="number" min="1" max="10" className="input-field !w-20"
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
                  <p className="text-gray-900 font-medium">{extractedData.locationName}</p>
                )}
              </div>
              <div>
                <label className="input-label">Description</label>
                {editing ? (
                  <textarea className="input-field min-h-[80px]" value={extractedData.description}
                    onChange={(e) => updateField("description", e.target.value)} />
                ) : (
                  <p className="text-gray-700 text-sm">{extractedData.description}</p>
                )}
              </div>
            </div>

            <button onClick={handleSave} disabled={saving} className="btn-accent w-full" id="save-survey-btn">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Confirm & Save to Dashboard</>}
            </button>
          </div>
        )}
      </div>
    </NGOSidebar>
  );
}
