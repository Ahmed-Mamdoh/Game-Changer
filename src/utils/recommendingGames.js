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

  userGames.forEach((ug) => {
    const rating = ug.game?.reviews?.[0]?.rating || 0;
    let weight = 0;

    if (rating === 5) weight = 1;
    else if (rating === 4) weight = 0.5;
    else if (rating === 3) weight = 0;
    else if (rating === 2) weight = -0.5;
    else if (rating === 1) weight = -0.1;

    if (weight === 0) return;

    // Process Genres
    ug.game?.genres?.forEach((genre) => {
      profile.genres[genre] = (profile.genres[genre] || 0) + weight;
    });

    // Process Themes
    ug.game?.themes?.forEach((theme) => {
      profile.themes[theme] = (profile.themes[theme] || 0) + weight;
    });
    // Process Keywords
    ug.game?.keywords?.forEach((keyword) => {
      profile.keywords[keyword] = (profile.keywords[keyword] || 0) + weight;
    });
  });
  return profile;
}

/**
 * Scores a candidate game against the user profile.
 * @param {Object} game - Game from IGDB.
 * @param {Object} userProfile - The profile built by buildUserProfile.
 * @returns {number} The total score.
 */
export function calculateGameScore(game, userProfile) {
  let score = 0;

  // Score based on genres
  game.genres?.forEach((g) => {
    if (userProfile.genres[g.name]) {
      score += userProfile.genres[g.name];
    }
  });

  // Score based on themes
  game.themes?.forEach((t) => {
    if (userProfile.themes[t.name]) {
      score += userProfile.themes[t.name];
    }
  });

  // Score based on keywords
  game.keywords?.forEach((k) => {
    if (userProfile.keywords[k.name]) {
      score += userProfile.keywords[k.name] / 2;
    }
  });

  // Small bonus for highly rated games in IGDB
  if (game.total_rating) {
    score += game.total_rating / 10;
  }

  return Math.round(score);
}
