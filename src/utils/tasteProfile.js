// Content-based recommender: turns a library into a weighted taste profile,
// then scores real IGDB candidates against it. Everything here is pure, so the
// same inputs always give the same picks and match scores.

// How much each kind of IGDB tag says about taste. Genres and themes describe
// what a game is; keywords are noisy; studios and series are weak hints, so a
// fan of one series isn't shown only its sequels.
const FEATURE_WEIGHTS = {
  genre: 1,
  theme: 1,
  keyword: 0.6,
  perspective: 0.5,
  mode: 0.5,
  developer: 0.35,
  series: 0.25,
};

// A library game's pull on the profile, roughly -1.5 (rated low and dropped)
// to +3 (rated 5, favorite, many hours).
const STATUS_WEIGHT = {
  finished: 0.5,
  playing: 0.4,
  "to play": 0.3,
  dropped: -0.8,
};

export function libraryGameWeight({
  status,
  rating,
  hours_played,
  is_favorite,
}) {
  let weight = STATUS_WEIGHT[status] ?? 0.3;
  // Ratings are 1-5 stars; 3 is neutral
  if (rating > 0) weight += (rating - 3) / 2;
  if (is_favorite) weight += 1;
  // Log scale so a 300-hour game doesn't drown out everything else. Hours on a
  // dropped game only show how long it took to give up.
  if (status !== "dropped" && hours_played > 0)
    weight += Math.min(Math.log1p(hours_played) / Math.log1p(100), 1) * 0.5;
  return weight;
}

// IGDB keywords about awards, stores, hardware and features rather than the
// game itself. Left in, "Game Awards nominee" becomes a taste.
const META_KEYWORD =
  /award|nominee|winner|controller|achievement|steam|cloud save|digital distribution|trading card|dlc|playstation|xbox|nintendo|\bpc\b|ps\d|exclusive|crowdfund|kickstarter|early access|game pass|epic games|gog|bestseller|voice acting|subtitles|languages?\b/i;

// Tag keys like "genre:12" for one IGDB game, plus readable names for the
// tags people would recognise.
export function gameFeatures(game) {
  const features = new Map();
  const add = (type, items, nameOf = (item) => item?.name) => {
    for (const item of items || []) {
      const id = typeof item === "object" ? item?.id : item;
      if (id == null) continue;
      features.set(`${type}:${id}`, nameOf(item) || null);
    }
  };
  add("genre", game.genres);
  add("theme", game.themes);
  add(
    "keyword",
    (game.keywords || []).filter(
      (keyword) => !keyword?.name || !META_KEYWORD.test(keyword.name),
    ),
  );
  add("perspective", game.player_perspectives);
  add("mode", game.game_modes);
  add(
    "developer",
    (game.involved_companies || [])
      .filter((ic) => ic.developer)
      .map((ic) => ic.company),
  );
  add("series", [...(game.franchises || []), ...(game.collections || [])]);
  return features;
}

const typeOf = (key) => key.slice(0, key.indexOf(":"));

// entries: [{ game, weight }] where game carries IGDB tag fields.
export function buildTasteProfile(entries) {
  const taste = new Map();
  const names = new Map();
  for (const { game, weight } of entries) {
    for (const [key, name] of gameFeatures(game)) {
      taste.set(key, (taste.get(key) || 0) + weight);
      if (name) names.set(key, name);
    }
  }

  // Per-type vector length, for cosine similarity
  const norms = {};
  for (const [key, value] of taste) {
    const type = typeOf(key);
    norms[type] = (norms[type] || 0) + value * value;
  }
  for (const type in norms) norms[type] = Math.sqrt(norms[type]);

  return { taste, norms, names, topTags: topTagsOf(taste, names) };
}

// The tags that define this player, for prompts and the page
function topTagsOf(taste, names) {
  return [...taste]
    .filter(
      ([key, value]) =>
        value > 0 && names.has(key) && FEATURE_WEIGHTS[typeOf(key)] >= 0.5,
    )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key]) => ({ key, type: typeOf(key), name: names.get(key) }));
}

// Tags that nearly every candidate has (single player, action) say little
// about fit; rare ones (souls-like, roguelite) say a lot. Returns a profile
// whose tags are weighted by how rare they are across the candidate pool.
export function withRarity(profile, pool) {
  const counts = new Map();
  for (const game of pool)
    for (const key of gameFeatures(game).keys())
      counts.set(key, (counts.get(key) || 0) + 1);
  const rarity = new Map();
  for (const [key, count] of counts)
    rarity.set(key, Math.log((pool.length + 1) / (count + 1)) + 1);

  const taste = new Map();
  const norms = {};
  for (const [key, value] of profile.taste) {
    const weighted = value * (rarity.get(key) || 1);
    taste.set(key, weighted);
    const type = typeOf(key);
    norms[type] = (norms[type] || 0) + weighted * weighted;
  }
  for (const type in norms) norms[type] = Math.sqrt(norms[type]);
  return {
    ...profile,
    taste,
    norms,
    rarity,
    topTags: topTagsOf(taste, profile.names),
  };
}

export function topIdsOfType(profile, type, count) {
  return [...profile.taste]
    .filter(([key, value]) => typeOf(key) === type && value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key]) => Number(key.slice(type.length + 1)));
}

// 0-1: how well a candidate's tags line up with the profile. Cosine per tag
// type, averaged by type weight over the types both sides have. With a
// rarity-weighted profile, the candidate's tags are weighted the same way.
export function tasteSimilarity(profile, candidate) {
  const perType = {};
  for (const key of gameFeatures(candidate).keys()) {
    const type = typeOf(key);
    const rarity = profile.rarity?.get(key) || 1;
    perType[type] ??= { dot: 0, count: 0 };
    perType[type].dot += (profile.taste.get(key) || 0) * rarity;
    perType[type].count += rarity * rarity;
  }
  let total = 0;
  let weightSum = 0;
  for (const type in perType) {
    const norm = profile.norms[type];
    if (!norm) continue;
    const cosine = perType[type].dot / (norm * Math.sqrt(perType[type].count));
    total += FEATURE_WEIGHTS[type] * cosine;
    weightSum += FEATURE_WEIGHTS[type];
  }
  return weightSum ? Math.max(0, total / weightSum) : 0;
}

// IGDB's 0-100 critic+user score, pulled toward 70 when few people rated it,
// so a 95 from four votes doesn't beat an 88 from four thousand.
export function qualityScore(game) {
  const votes = game.total_rating_count || 0;
  const rating = game.total_rating || 70;
  const prior = 50;
  return (
    ((votes / (votes + prior)) * rating + (prior / (votes + prior)) * 70) / 100
  );
}

// similarTo: Map candidateId -> [{ id, name, weight }] of library games that
// list the candidate in IGDB's similar_games.
export function scoreCandidate(profile, candidate, similarTo) {
  const similarity = tasteSimilarity(profile, candidate);
  const sources = similarTo.get(candidate.id) || [];
  const liked = sources.filter((s) => s.weight > 0);
  const disliked = sources.filter((s) => s.weight < 0);
  // IGDB's similar_games links from liked games are the strongest hint; a
  // game listed by several of them gets the most
  const linkBoost =
    Math.min(
      liked.reduce((sum, s) => sum + s.weight, 0),
      4,
    ) *
      0.05 -
    disliked.length * 0.08;

  const fit = Math.min(Math.max(similarity + linkBoost, 0), 1);
  const score = fit * 0.75 + qualityScore(candidate) * 0.25;
  // Raw cosines bunch between 0.2 and 0.6; the square root spreads them into
  // a readable range without changing the order.
  const match = Math.round(Math.sqrt(fit) * 100);
  const becauseOf = [...liked].sort((a, b) => b.weight - a.weight)[0] || null;
  return { score, match: Math.min(match, 99), becauseOf };
}

// Greedy pick that keeps the list varied: at most one game per series and two
// per "because of" game. No genre cap: IGDB lists genres by id, so the first
// genre is arbitrary, and a player who loves RPGs should get RPGs.
export function pickVaried(scored, count) {
  const picked = [];
  const seriesUsed = new Set();
  const sourceCount = new Map();
  for (const item of [...scored].sort((a, b) => b.score - a.score)) {
    if (picked.length >= count) break;
    const series = [
      ...(item.game.franchises || []),
      ...(item.game.collections || []),
    ].map((s) => s.id ?? s);
    if (series.some((id) => seriesUsed.has(id))) continue;
    const source = item.becauseOf?.id;
    if (source != null && (sourceCount.get(source) || 0) >= 2) continue;

    picked.push(item);
    series.forEach((id) => seriesUsed.add(id));
    if (source != null)
      sourceCount.set(source, (sourceCount.get(source) || 0) + 1);
  }
  return picked;
}
