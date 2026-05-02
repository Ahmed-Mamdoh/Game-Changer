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
  };

  if (!userGames || userGames.length === 0) return profile;

  userGames.forEach((ug) => {
    const rating = ug.game?.reviews?.[0]?.rating || 0;
    let weight = 0;

    if (rating === 5) weight = 1;
    else if (rating === 4) weight = 0.5;
    else if (rating === 3) weight = 0;
    else if (rating === 2) weight = -0.5;
    else if (rating === 1) weight = -1;

    if (weight === 0) return;

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
      if (name) profile.keywords[name] = (profile.keywords[name] || 0) + weight;
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
  return profile;
}

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

  // Score based on genres (Max 25 points)
  if (game.genres?.length) {
    const sum = game.genres.reduce(
      (acc, g) => acc + (userProfile.genres[g.name] || 0),
      0,
    );
    // Average affinity across game genres, scaled to 20
    genreScore = sum * 35;
  }

  // Score based on themes (Max 20 points)
  if (game.themes?.length) {
    const sum = game.themes.reduce(
      (acc, t) => acc + (userProfile.themes[t.name] || 0),
      0,
    );
    // Average affinity across game themes, scaled to 20
    themeScore = sum * 20;
  }

  // Score based on keywords (Max 40 points)
  if (game.keywords?.length) {
    const sum = game.keywords.reduce(
      (acc, k) => acc + (userProfile.keywords[k.name] || 0),
      0,
    );
    // Average affinity across game keywords, scaled to 40
    keywordScore = sum * 13;
  }

  // Small bonus for highly rated games in IGDB (Max 10 points)
  const ratingScore = (game.total_rating || 0) / 10;

  // Total score clamped to 0-100
  const totalScore = Math.max(
    0,
    Math.min(1000000, genreScore + themeScore + keywordScore),
  );

  return Math.round(totalScore);
}
