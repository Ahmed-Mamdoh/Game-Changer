/**
 * Calculate similarity score between two strings (0-1)
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score between 0 and 1
 */
function calculateStringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;

  let longer = str1.length > str2.length ? str1 : str2;
  let shorter = str1.length > str2.length ? str2 : str1;

  if (shorter.length === 0) return 1.0;

  // Count matching characters
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
      // Remove the matched character to avoid double counting
      const index = longer.indexOf(shorter[i]);
      if (index !== -1) {
        longer = longer.substring(0, index) + longer.substring(index + 1);
      }
    }
  }

  return (
    (matches / shorter.length) * 0.5 +
    (Math.min(shorter.length, longer.length) /
      Math.max(shorter.length, longer.length)) *
      0.5
  );
}

/**
 * Normalize game name for comparison
 * @param {string} name - Game name to normalize
 * @returns {string} Normalized game name
 */
function normalizeGameName(name) {
  if (!name) return "";

  return name
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s:()-]/g, "")
    .replace(/\s+/g, " ")
    .replace(/(\bthe\b|\ba\b|\ban\b)\s+/gi, "")
    .replace(/[.:,-]/g, " ")
    .replace(/\s+/g, " ");
}

/**
 * Extract base game name by removing common suffixes
 * @param {string} name - Game name to process
 * @returns {string} Base game name
 */
function extractBaseGameName(name) {
  if (!name) return "";

  const normalized = normalizeGameName(name);

  // Remove common suffixes
  const suffixes = [
    "deluxe edition",
    "definitive edition",
    "game of the year",
    "goty",
    "remastered",
    "remaster",
    "enhanced edition",
    "director's cut",
    "directors cut",
    "complete edition",
    "special edition",
    "collector's edition",
    "collectors edition",
    "anniversary edition",
    "legendary edition",
    "ultimate edition",
    "digital deluxe",
    "premium edition",
    "gold edition",
    "season pass",
    "bundle",
    "pack",
    "edition",
  ];

  let result = normalized;
  for (const suffix of suffixes) {
    const regex = new RegExp(
      `\\b${suffix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    );
    result = result.replace(regex, "");
  }

  // Remove anything in parentheses
  result = result.replace(/\([^)]*\)/g, "");

  // Remove content after common separators
  result = result.replace(/\s*[-:–—]\s*.*/g, "");

  return result.trim();
}

/**
 * Find best matching game from IGDB results
 * @param {Array} igdbGames - Array of IGDB game objects
 * @param {string} targetName - Target game name to match
 * @returns {Object|null} Best matching game or null
 */
function findBestMatchingGame(igdbGames, targetName) {
  if (!igdbGames || igdbGames.length === 0 || !targetName) {
    return null;
  }

  const targetNormalized = normalizeGameName(targetName);
  const targetBase = extractBaseGameName(targetName);

  // Try exact match first
  const exactMatch = igdbGames.find(
    (game) => normalizeGameName(game.name) === targetNormalized,
  );

  if (exactMatch) return exactMatch;

  // Try base name match
  const baseMatch = igdbGames.find(
    (game) => extractBaseGameName(game.name) === targetBase,
  );

  if (baseMatch) return baseMatch;

  // Try fuzzy matching with similarity scoring
  let bestMatch = null;
  let bestScore = 0.6; // Minimum similarity threshold

  for (const game of igdbGames) {
    const gameNormalized = normalizeGameName(game.name);
    const gameBase = extractBaseGameName(game.name);

    // Check similarity with full names
    const fullNameScore = calculateStringSimilarity(
      gameNormalized,
      targetNormalized,
    );

    // Check similarity with base names
    const baseNameScore = calculateStringSimilarity(gameBase, targetBase);

    // Use the better of the two scores
    const score = Math.max(fullNameScore, baseNameScore);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = game;
    }
  }

  return bestMatch;
}

export { findBestMatchingGame, normalizeGameName };
