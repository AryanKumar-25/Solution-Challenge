/**
 * Volunteer matching algorithm.
 * Matches volunteers to community needs based on skills and location proximity.
 */

// Category-to-skill mapping
const CATEGORY_SKILLS = {
  food: ["food distribution", "logistics"],
  medical: ["first aid", "medical", "counseling"],
  shelter: ["logistics", "first aid"],
  education: ["teaching", "counseling"],
};

/**
 * Calculate distance between two lat/lng points in km (Haversine formula).
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate match score for a volunteer against a need.
 * @param {Object} volunteer - Volunteer object with skills, lat, lng.
 * @param {Object} need - Need object with category, lat, lng.
 * @returns {Object} { score, distance, skillMatch }
 */
export function calculateMatchScore(volunteer, need) {
  let skillScore = 0;
  let distance = 0;
  let skillMatch = false;

  // Skill matching (50 points max)
  const relevantSkills = CATEGORY_SKILLS[need.category] || [];
  const volunteerSkills = (volunteer.skills || []).map((s) =>
    s.toLowerCase()
  );

  for (const skill of relevantSkills) {
    if (volunteerSkills.includes(skill.toLowerCase())) {
      skillMatch = true;
      skillScore = 50;
      break;
    }
  }

  // Proximity scoring (50 points max)
  if (volunteer.lat && volunteer.lng && need.lat && need.lng) {
    distance = haversineDistance(
      volunteer.lat,
      volunteer.lng,
      need.lat,
      need.lng
    );

    // Score based on distance (closer = higher score)
    if (distance <= 5) {
      // Within 5km
      skillScore += 50;
    } else if (distance <= 15) {
      skillScore += 40;
    } else if (distance <= 30) {
      skillScore += 30;
    } else if (distance <= 50) {
      skillScore += 20;
    } else if (distance <= 100) {
      skillScore += 10;
    }
    // Beyond 100km gets 0 proximity points
  }

  return {
    score: skillScore,
    distance: Math.round(distance * 10) / 10,
    skillMatch,
  };
}

/**
 * Match volunteers to a specific need.
 * @param {Array} volunteers - Array of volunteer objects.
 * @param {Object} need - The need to match against.
 * @returns {Array} Sorted array of { volunteer, score, distance, skillMatch }.
 */
export function matchVolunteersToNeed(volunteers, need) {
  const matches = volunteers
    .filter((v) => v.isAvailable)
    .map((volunteer) => {
      const { score, distance, skillMatch } = calculateMatchScore(
        volunteer,
        need
      );
      return { volunteer, score, distance, skillMatch };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Find matching needs for a specific volunteer.
 * @param {Object} volunteer - Volunteer object.
 * @param {Array} needs - Array of open needs.
 * @returns {Array} Sorted array of { need, score, distance, skillMatch }.
 */
export function matchNeedsToVolunteer(volunteer, needs) {
  const matches = needs
    .filter((n) => n.status === "open")
    .map((need) => {
      const { score, distance, skillMatch } = calculateMatchScore(
        volunteer,
        need
      );
      return { need, score, distance, skillMatch };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score);

  return matches;
}
