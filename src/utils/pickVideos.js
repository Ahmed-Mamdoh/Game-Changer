// IGDB has no video type, only a free-text name, so videos are sorted by what
// their name says. Gameplay comes first, then official trailers; teasers,
// cutscenes, behind-the-scenes, character and patch videos are left out.
const GAMEPLAY = /\bgame\s?play\b/i;
const SKIP =
  /teaser|cutscene|cinematic|behind|diar(y|ies)|interview|character|livestream|stream|story|lore|version|patch|update|showcase|developer|dev\b|making of|q\s?&\s?a|commentary|recap|anniversary|collab/i;
const TRAILER = /trailer|launch|announce|reveal|release|official/i;

export function pickVideos(videos) {
  if (!videos?.length) return [];

  const seen = new Set();
  const gameplay = [];
  const trailers = [];

  for (const video of videos) {
    if (!video?.video_id || seen.has(video.video_id)) continue;
    seen.add(video.video_id);
    const name = video.name ?? "";
    if (GAMEPLAY.test(name)) gameplay.push(video);
    else if (!SKIP.test(name) && TRAILER.test(name)) trailers.push(video);
  }

  const picked = [...gameplay, ...trailers];
  // Never leave a game with videos showing none
  return picked.length ? picked : [videos.find((video) => video?.video_id)].filter(Boolean);
}
