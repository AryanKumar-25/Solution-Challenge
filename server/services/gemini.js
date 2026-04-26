/**
 * Gemini Vision service — server-side only.
 * API key is read from process.env, NEVER exposed to the browser.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const SURVEY_PROMPT = `You are a survey data extraction assistant for an NGO volunteer coordination platform. 
Analyze this uploaded survey/document image and extract the following information in JSON format:

{
  "rawText": "The full text content you can read from the document",
  "description": "A concise summary of the community need described",
  "category": "One of: food, medical, shelter, education",
  "urgencyScore": A number from 1-10 indicating urgency (10 = most urgent),
  "locationName": "The location mentioned in the document, or 'Unknown' if not found",
  "suggestedLat": null,
  "suggestedLng": null
}

If you cannot determine a field, make your best guess based on context.
Return ONLY valid JSON, no markdown formatting.`;

/**
 * Extract survey data from a base64-encoded image using Gemini Vision.
 * @param {string} base64Data - Base64-encoded image data (without data URI prefix).
 * @param {string} mimeType - MIME type of the image (e.g. "image/jpeg").
 * @returns {Object} Extracted structured data.
 */
export async function extractSurveyFromImage(base64Data, mimeType) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set, returning mock data.");
    return mockExtraction();
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      SURVEY_PROMPT,
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
    ]);

    const responseText = result.response.text();

    // Parse JSON from the response (handle markdown wrapping)
    let cleanJson = responseText;
    if (responseText.includes("```json")) {
      cleanJson = responseText.split("```json")[1].split("```")[0].trim();
    } else if (responseText.includes("```")) {
      cleanJson = responseText.split("```")[1].split("```")[0].trim();
    }

    const parsed = JSON.parse(cleanJson);

    return {
      rawText: parsed.rawText || "Text extracted from survey document.",
      description: parsed.description || "Community need identified from survey.",
      category: validateCategory(parsed.category),
      urgencyScore: Math.max(1, Math.min(10, parsed.urgencyScore || 5)),
      locationName: parsed.locationName || "Unknown",
      suggestedLat: parsed.suggestedLat || null,
      suggestedLng: parsed.suggestedLng || null,
    };
  } catch (error) {
    console.error("Gemini extraction failed:", error.message);
    return mockExtraction();
  }
}

function validateCategory(category) {
  const valid = ["food", "medical", "shelter", "education"];
  if (category && valid.includes(category.toLowerCase())) {
    return category.toLowerCase();
  }
  return "food";
}

function mockExtraction() {
  return {
    rawText: "Survey document analyzed (mock fallback).\n\nThis community survey indicates food-related needs in the local area.",
    description: "Food distribution and nutrition support needed in the surveyed area.",
    category: "food",
    urgencyScore: 6,
    locationName: "Survey Area",
    suggestedLat: null,
    suggestedLng: null,
  };
}
