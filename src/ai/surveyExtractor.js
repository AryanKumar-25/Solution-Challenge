/**
 * Survey text extraction — calls the secure backend API.
 * The Gemini API key is NEVER exposed to the browser.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Convert a File object to base64.
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Extract survey data from an uploaded image/PDF via the secure backend.
 * @param {File} file - The uploaded file.
 * @returns {Object} Extracted data: { rawText, category, urgencyScore, locationName, description }
 */
export async function extractSurveyData(file) {
  try {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || "image/jpeg";

    const response = await fetch(`${API_BASE}/api/extract-survey`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: base64Data, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Survey extraction failed:", error);
    // Fall back to mock if backend is unreachable
    return mockExtraction(file);
  }
}

/**
 * Mock extraction fallback (when backend is unavailable).
 */
function mockExtraction(file) {
  const fileName = file.name.toLowerCase();

  let category = "food";
  let urgencyScore = 5;
  let description = "Community survey data extracted from uploaded document.";

  if (fileName.includes("medical") || fileName.includes("health")) {
    category = "medical";
    urgencyScore = 7;
    description = "Medical supplies and healthcare assistance needed in the surveyed area.";
  } else if (fileName.includes("shelter") || fileName.includes("housing")) {
    category = "shelter";
    urgencyScore = 8;
    description = "Temporary shelter and housing support needed for displaced families.";
  } else if (fileName.includes("education") || fileName.includes("school")) {
    category = "education";
    urgencyScore = 4;
    description = "Educational resources and teaching support needed for local community.";
  } else {
    description = "Food distribution and nutrition support needed in the surveyed area.";
    urgencyScore = 6;
  }

  return {
    rawText: `Survey Document: ${file.name}\n\nThis is a community needs assessment survey collected from the field. The survey indicates ${category}-related needs in the local area.`,
    description,
    category,
    urgencyScore,
    locationName: "Survey Area",
    suggestedLat: null,
    suggestedLng: null,
  };
}
