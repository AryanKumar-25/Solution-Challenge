/**
 * Rule-based urgency scoring for community needs.
 * Analyzes the description text and assigns a score from 1-10.
 */

const HIGH_URGENCY_KEYWORDS = [
  "dying", "death", "dead", "emergency", "critical", "urgent", "life-threatening",
  "no food", "starvation", "starving", "flood", "earthquake", "fire", "collapse",
  "bleeding", "unconscious", "trapped", "drowning", "epidemic", "outbreak",
  "homeless", "stranded", "severe", "crisis", "disaster", "immediate",
  "no water", "contaminated", "dangerous", "violence", "attack",
];

const MEDIUM_URGENCY_KEYWORDS = [
  "need help", "shortage", "running low", "struggling", "difficult",
  "limited supply", "overcrowded", "understaffed", "lack of", "insufficient",
  "broken", "damaged", "unsafe", "poor condition", "deteriorating",
  "need assistance", "support needed", "help required", "vulnerable",
  "at risk", "concern", "worried", "sick", "injured", "infection",
];

const LOW_URGENCY_KEYWORDS = [
  "would like", "optional", "improvement", "nice to have", "eventually",
  "when possible", "future", "planning", "suggestion", "minor",
  "cosmetic", "upgrade", "enhancement", "convenient", "preference",
  "wish", "hope", "consider", "maybe", "possible",
];

/**
 * Score urgency based on keyword matching.
 * @param {string} description - The need description text.
 * @returns {number} Urgency score from 1-10.
 */
export function scoreUrgency(description) {
  if (!description || typeof description !== "string") return 5;

  const text = description.toLowerCase();
  let score = 5; // default baseline

  // Check for high urgency keywords
  let highCount = 0;
  for (const keyword of HIGH_URGENCY_KEYWORDS) {
    if (text.includes(keyword)) {
      highCount++;
    }
  }

  // Check for medium urgency keywords
  let medCount = 0;
  for (const keyword of MEDIUM_URGENCY_KEYWORDS) {
    if (text.includes(keyword)) {
      medCount++;
    }
  }

  // Check for low urgency keywords
  let lowCount = 0;
  for (const keyword of LOW_URGENCY_KEYWORDS) {
    if (text.includes(keyword)) {
      lowCount++;
    }
  }

  // Calculate score
  if (highCount >= 3) {
    score = 10;
  } else if (highCount === 2) {
    score = 9;
  } else if (highCount === 1) {
    score = 8;
  } else if (medCount >= 3) {
    score = 7;
  } else if (medCount === 2) {
    score = 6;
  } else if (medCount === 1) {
    score = 5;
  } else if (lowCount >= 2) {
    score = 2;
  } else if (lowCount === 1) {
    score = 3;
  }

  // Clamp between 1-10
  return Math.max(1, Math.min(10, score));
}

/**
 * Get urgency level from score.
 */
export function getUrgencyLevel(score) {
  if (score >= 8) return "high";
  if (score >= 4) return "medium";
  return "low";
}

/**
 * Get urgency label.
 */
export function getUrgencyLabel(score) {
  if (score >= 8) return "Critical";
  if (score >= 4) return "Moderate";
  return "Low";
}
