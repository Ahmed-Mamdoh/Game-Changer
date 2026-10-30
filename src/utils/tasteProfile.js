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

const developersOf = (game) =>
  (game.involved_companies || [])
    .filter((ic) => ic.developer)
    .map((ic) => ic.company?.id ?? ic.company);
// Franchise and collection ids are separate id spaces, so keep them apart
const seriesOf = (game) => [
  ...(game.franchises || []).map((s) => `franchise:${s.id ?? s}`),
  ...(game.collections || []).map((s) => `collection:${s.id ?? s}`),
];

// What ties each candidate back to the library. entries: [{ id, name, weight,
// game }] with IGDB details. Each map goes from an id (candidate, studio or
// series) to the library games behind it.
export function buildLibraryLinks(entries) {
  const similarTo = new Map();
  const byStudio = new Map();
  const bySeries = new Map();
  const push = (map, key, entry) => {
    if (key == null) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({ id: entry.id, name: entry.name, weight: entry.weight });
  };
  for (const entry of entries) {
    for (const id of entry.game.similar_games || []) push(similarTo, id, entry);
    for (const id of new Set(developersOf(entry.game)))
      push(byStudio, id, entry);
    for (const id of new Set(seriesOf(entry.game))) push(bySeries, id, entry);
  }
  // Liked games with their tags, to find which ones a pick draws on
  const liked = entries
    .filter((entry) => entry.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 30)
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      weight: entry.weight,
      features: gameFeatures(entry.game),
    }));
  return { similarTo, byStudio, bySeries, liked };
}

const strongest = (sources) =>
  [...sources].sort((a, b) => b.weight - a.weight)[0] || null;
const sumWeights = (sources) => sources.reduce((sum, s) => sum + s.weight, 0);

// 0-1: how well known a game is. Players trust picks they have heard of; a
// game with 3000+ ratings on IGDB counts as fully known.
export function familiarity(game) {
  return Math.min(
    Math.log10((game.total_rating_count || 0) + 1) / Math.log10(3000),
    1,
  );
}

// Fit is tag overlap plus three direct ties to the library, strongest first:
// the same series as a liked game (a sequel), the same studio as several liked
// games, and IGDB listing it as similar to liked games.
export function scoreCandidate(profile, candidate, links) {
  const similarity = tasteSimilarity(profile, candidate);
  const collect = (map, ids) => {
    const seen = new Set();
    return ids
      .flatMap((id) => map.get(id) || [])
      .filter((s) => !seen.has(s.id) && seen.add(s.id));
  };
  const similar = links.similarTo.get(candidate.id) || [];
  const studio = collect(links.byStudio, developersOf(candidate));
  const series = collect(links.bySeries, seriesOf(candidate));
  const liked = (sources) => sources.filter((s) => s.weight > 0);
  const disliked = (sources) => sources.filter((s) => s.weight < 0);

  // One liked game in a series is enough for a sequel to matter
  const seriesBoost =
    Math.min(sumWeights(liked(series)) / 2, 1) * 0.3 -
    Math.min(-sumWeights(disliked(series)) / 2, 1) * 0.2;
  // A studio counts once the player liked two or more of its games
  const studioBoost =
    (liked(studio).length >= 2
      ? Math.min(sumWeights(liked(studio)) / 4, 1) * 0.25
      : 0) -
    Math.min(-sumWeights(disliked(studio)) / 2, 1) * 0.15;
  const similarBoost =
    Math.min(sumWeights(liked(similar)), 4) * 0.04 -
    disliked(similar).length * 0.08;

  const fit = Math.min(
    Math.max(similarity * 0.7 + seriesBoost + studioBoost + similarBoost, 0),
    1,
  );
  const score =
    fit * 0.7 + qualityScore(candidate) * 0.15 + familiarity(candidate) * 0.15;
  // Raw fits bunch between 0.2 and 0.7; the square root spreads them into a
  // readable range without changing the order.
  const match = Math.min(Math.round(Math.sqrt(fit) * 100), 99);

  let link = null;
  let becauseOf = null;
  if (seriesBoost > 0) {
    link = "series";
    becauseOf = strongest(liked(series));
  } else if (studioBoost > 0) {
    link = "studio";
    becauseOf = strongest(liked(studio));
  } else if (liked(similar).length) {
    link = "similar";
    becauseOf = strongest(liked(similar));
  }
  // Name of the shared studio, for reasons written without the model
  const studioName =
    link === "studio"
      ? (candidate.involved_companies || []).find(
          (ic) =>
            ic.developer && links.byStudio.has(ic.company?.id ?? ic.company),
        )?.company?.name || null
      : null;
  return { score, match, becauseOf, link, studioName };
}

// Tags that say how a game plays or feels; modes, studios and series say
// little about why two games click
const TRAIT_TYPES = new Set(["genre", "theme", "keyword"]);
// Rarity-weighted overlap a liked game needs to count as a reason: one fairly
// rare tag, or two common ones
const MIN_SOURCE_GAIN = 3.5;
const MAX_SOURCES = 3;

// Names of the traits a candidate shares with one library game, rarest first
export function sharedTraits(profile, candidate, features, count = 3) {
  const rarity = (key) => profile.rarity?.get(key) || 1;
  return [...gameFeatures(candidate)]
    .filter(
      ([key, name]) =>
        name && TRAIT_TYPES.has(typeOf(key)) && features.has(key),
    )
    .sort(([a], [b]) => rarity(b) - rarity(a))
    .slice(0, count)
    .map(([, name]) => name);
}

// The liked games a pick draws on, one to three, each with the traits it adds
// that the games before it don't. The tie from scoreCandidate (lead) stays
// first. Another game joins only when it brings something new, so a pick reads
// as "Elden Ring's bosses plus Hades's runs", not three games sharing "action".
export function sourceGames(profile, candidate, links, lead) {
  const traits = new Map(
    [...gameFeatures(candidate)].filter(
      ([key, name]) => name && TRAIT_TYPES.has(typeOf(key)),
    ),
  );
  const rarity = (key) => profile.rarity?.get(key) || 1;
  const listedSimilar = new Set(
    (links.similarTo.get(candidate.id) || []).map((s) => s.id),
  );
  const covered = new Set();
  const sources = [];
  const take = (source, keys) => {
    const brings = keys
      .filter((key) => !covered.has(key))
      .sort((a, b) => rarity(b) - rarity(a));
    brings.forEach((key) => covered.add(key));
    sources.push({
      id: source.id,
      name: source.name,
      weight: source.weight,
      shared: brings.slice(0, 2).map((key) => traits.get(key)),
    });
  };
  const sharedWith = (source) =>
    [...traits.keys()].filter((key) => source.features.has(key));

  if (lead) {
    const entry = links.liked.find((s) => s.id === lead.id);
    take(lead, entry ? sharedWith(entry) : []);
  }
  while (sources.length < MAX_SOURCES) {
    let best = null;
    for (const source of links.liked) {
      if (sources.some((s) => s.id === source.id)) continue;
      const fresh = sharedWith(source).filter((key) => !covered.has(key));
      // IGDB listing the pick as similar counts as a rare shared tag
      const gain =
        fresh.reduce((sum, key) => sum + rarity(key), 0) +
        (listedSimilar.has(source.id) ? 2 : 0);
      if (gain < MIN_SOURCE_GAIN) continue;
      const rank = gain * (0.6 + 0.2 * Math.min(source.weight, 3));
      if (!best || rank > best.rank) best = { source, fresh, rank };
    }
    if (!best) break;
    take(best.source, best.fresh);
  }
  return sources;
}

// Score taken off games released in or before the year the player calls too
// old: 0.2 at that year, growing with age up to 0.4. Soft, so a classic that
// fits very well can still make the list.
export function agePenalty(year, yearFloor) {
  if (!year || !yearFloor || year > yearFloor) return 0;
  return Math.min(0.2 + (yearFloor - year) * 0.02, 0.4);
}

// Greedy pick that keeps the list varied: at most two games per series and
// two per "because of" game. No genre cap: IGDB lists genres by id, so the first
// genre is arbitrary, and a player who loves RPGs should get RPGs.
export function pickVaried(scored, count) {
  const picked = [];
  const seriesUsed = new Map();
  const sourceCount = new Map();
  for (const item of [...scored].sort((a, b) => b.score - a.score)) {
    if (picked.length >= count) break;
    const series = [
      ...(item.game.franchises || []),
      ...(item.game.collections || []),
    ].map((s) => s.id ?? s);
    if (series.some((id) => (seriesUsed.get(id) || 0) >= 2)) continue;
    const source = item.becauseOf?.id;
    if (source != null && (sourceCount.get(source) || 0) >= 2) continue;

    picked.push(item);
    series.forEach((id) => seriesUsed.set(id, (seriesUsed.get(id) || 0) + 1));
    if (source != null)
      sourceCount.set(source, (sourceCount.get(source) || 0) + 1);
  }
  return picked;
}
