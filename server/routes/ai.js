import express from "express";
import rateLimit from "express-rate-limit";
import { extractSurveyFromImage } from "../services/gemini.js";

export const router = express.Router();

// Stricter rate limit for AI endpoints — 10 per minute per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "AI rate limit exceeded. Please wait before trying again." },
});

/**
 * POST /api/extract-survey
 * Accepts: { imageBase64: string, mimeType: string }
 * Returns: { rawText, description, category, urgencyScore, locationName, ... }
 */
router.post("/extract-survey", aiLimiter, async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    // Validate input
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ error: "imageBase64 is required and must be a string." });
    }
    if (!mimeType || typeof mimeType !== "string") {
      return res.status(400).json({ error: "mimeType is required (e.g. 'image/jpeg')." });
    }

    // Validate base64 size (max ~7MB raw = ~10MB base64)
    if (imageBase64.length > 10_000_000) {
      return res.status(413).json({ error: "Image too large. Max 7MB." });
    }

    // Validate mimeType
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({ error: `Unsupported file type: ${mimeType}` });
    }

    const result = await extractSurveyFromImage(imageBase64, mimeType);
    res.json(result);
  } catch (error) {
    console.error("Survey extraction error:", error);
    res.status(500).json({ error: "Survey extraction failed. Please try again." });
  }
});

/**
 * POST /api/generate
 * Generic text generation endpoint.
 * Accepts: { prompt: string }
 * Returns: { text: string }
 */
router.post("/generate", aiLimiter, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt is required and must be a string." });
    }
    if (prompt.length > 5000) {
      return res.status(400).json({ error: "Prompt too long. Max 5000 characters." });
    }

    // Lazy import to avoid loading Gemini for non-AI routes
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "AI service not configured." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ text });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Text generation failed." });
  }
});
