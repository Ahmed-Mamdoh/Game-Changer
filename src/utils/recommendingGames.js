/**
 * Builds a weighted profile of genres and themes based on user ratings.
 * @param {Array} userGames - Array of games with ratings and genres/themes.
 * @returns {Object} { genres: { name: score }, themes: { name: score } }
 */
export function buildWeightedProfile(userGames) {
  const profile = {
    genres: {},
    themes: {},
    keywords: {},
    modes: {},
    perspectives: {},
    companies: {},
    playedGames: {}, // { name: weight }
  };

  if (!userGames || userGames.length === 0) return profile;

  userGames.forEach((ug) => {
    const rating = ug.game?.reviews?.[0]?.rating || 0;
    let weight = 0;

    if (rating === 5) weight = 1;
    else if (rating === 4) weight = 0.5;
    else if (rating === 3) weight = 0.1;
    else if (rating === 2) weight = -0.5;
    else if (rating === 1) weight = -1;

    const gameName = ug.game?.name;
    if (gameName) profile.playedGames[gameName.toLowerCase()] = weight;

    // Process Genres
    ug.game?.genres?.forEach((genre) => {
      const name = typeof genre === "string" ? genre : genre.name;
      if (name) profile.genres[name] = (profile.genres[name] || 0) + weight;
    });

    // Process Themes
    ug.game?.themes?.forEach((theme) => {
      const name = typeof theme === "string" ? theme : theme.name;
      if (name) profile.themes[name] = (profile.themes[name] || 0) + weight;
    });
    // Process Keywords
    ug.game?.keywords?.forEach((keyword) => {
      const name = typeof keyword === "string" ? keyword : keyword.name;
      if (name && !isJunkKeyword(name)) {
        profile.keywords[name] = (profile.keywords[name] || 0) + weight;
      }
    });
    // Process Modes
    ug.game?.modes?.forEach((mode) => {
      const name = typeof mode === "string" ? mode : mode.name;
      if (name) profile.modes[name] = (profile.modes[name] || 0) + weight;
    });
    // Process Perspectives
    ug.game?.perspectives?.forEach((perspective) => {
      const name =
        typeof perspective === "string" ? perspective : perspective.name;
      if (name)
        profile.perspectives[name] = (profile.perspectives[name] || 0) + weight;
    });
    // Process Companies
    ug.game?.companies?.forEach((company) => {
      const name = typeof company === "string" ? company : company.company.name;
      if (name)
        profile.companies[name] = (profile.companies[name] || 0) + weight;
    });
  });

  // Normalize scores by total games count to get a ratio (-1 to 1)
  const totalGames = userGames.length;
  const normalize = (obj) => {
    Object.keys(obj).forEach((key) => {
      obj[key] = obj[key] / totalGames;
    });
  };

  normalize(profile.genres);
  normalize(profile.themes);
  normalize(profile.keywords);
  normalize(profile.modes);
  normalize(profile.perspectives);
  normalize(profile.companies);

  return profile;
}

const REDUNDANT_TERMS = [
  "remastered",
  "remaster",
  "remake",
  "definitive edition",
  "game of the year edition",
  "goty",
  "deluxe edition",
  "enhanced edition",
  "collector's edition",
];

const JUNK_KEYWORDS = [
  "xbox",
  "steam",
  "controller",
  "playstation",
  "nintendo",
  "the game awards",
  "available on",
  "handheld",
  "multiplayer",
];

const isJunkKeyword = (name) => {
  const lower = name?.toLowerCase() || "";
  return JUNK_KEYWORDS.some((term) => lower.includes(term));
};

/**
 * Scores a candidate game against the user profile.
 * Returns a score between 0 and 100.
 * @param {Object} game - Game from IGDB.
 * @param {Object} userProfile - The profile built by buildUserProfile.
 * @returns {number} The total score (0-100).
 */
export function calculateGameScore(game, userProfile) {
  let genreScore = 0;
  let themeScore = 0;
  let keywordScore = 0;
  let modeScore = 0;
  let perspectiveScore = 0;
  let companyScore = 0;
  let titleScore = 0;

  if (game.name && userProfile.playedGames) {
    const candidateName = game.name.toLowerCase();

    // 1. Redundancy Check (Remasters/Remakes)
    const isRedundant = Object.keys(userProfile.playedGames).some(
      (playedName) => {
        if (candidateName === playedName) return true;
        return REDUNDANT_TERMS.some((term) => {
          const withTerm = `${playedName} ${term}`;
          const withTermAlt = `${playedName}: ${term}`;
          const playedWithTerm = `${candidateName} ${term}`;
          const playedWithTermAlt = `${candidateName}: ${term}`;

          return (
            candidateName === withTerm ||
            candidateName === withTermAlt ||
            playedName === playedWithTerm ||
            playedName === playedWithTermAlt
          );
        });
      },
    );

    if (isRedundant) return 0;

    // 2. Sequel/Prequel Matching
    Object.entries(userProfile.playedGames).forEach(([playedName, weight]) => {
      if (candidateName === playedName) return;

      const escapedPlayed = playedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const escapedCandidate = candidateName.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      const isSequel = new RegExp(`^${escapedPlayed}\\b`, "i").test(
        candidateName,
      );
      const isPrequel = new RegExp(`^${escapedCandidate}\\b`, "i").test(
        playedName,
      );

      if (isSequel || isPrequel) {
        titleScore += weight * 50;
      }
    });
  }

  if (game.genres?.length) {
    const sum = game.genres.reduce(
      (acc, g) => acc + (userProfile.genres[g.name] || 0),
      0,
    );
    genreScore = (sum / game.genres.length) * 65;
  }

  if (game.themes?.length) {
    const sum = game.themes.reduce(
      (acc, t) => acc + (userProfile.themes[t.name] || 0),
      0,
    );
    themeScore = (sum / game.themes.length) * 60;
  }

  if (game.keywords?.length) {
    const validKeywords = game.keywords.filter((k) => !isJunkKeyword(k.name));
    if (validKeywords.length > 0) {
      const sum = validKeywords.reduce(
        (acc, k) => acc + (userProfile.keywords[k.name] || 0),
        0,
      );
      keywordScore = (sum / validKeywords.length) * 300;
    }
  }

  if (game.player_perspectives?.length) {
    const sum = game.player_perspectives.reduce(
      (acc, p) => acc + (userProfile.perspectives[p.name] || 0),
      0,
    );
    perspectiveScore = (sum / game.player_perspectives.length) * 34;
  }

  if (game?.involved_companies?.length) {
    const sum = game.involved_companies.reduce(
      (acc, c) => acc + (userProfile.companies[c.company.name] || 0),
      0,
    );
    companyScore = (sum / game.involved_companies.length) * 250;
  }

  if (game.game_modes?.length) {
    const sum = game.game_modes.reduce(
      (acc, m) => acc + (userProfile.modes[m.name] || 0),
      0,
    );
    modeScore = (sum / game.game_modes.length) * 20;
  }

  const totalScore = Math.max(
    0,
    Math.min(
      100,
      genreScore +
        themeScore +
        keywordScore +
        modeScore +
        perspectiveScore +
        companyScore +
        titleScore,
    ),
  );

  return Math.round(totalScore);
}
