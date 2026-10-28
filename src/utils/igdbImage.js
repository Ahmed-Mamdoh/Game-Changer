function formatIGDBImage(url, size) {
  return url?.replace("t_thumb", size)?.replace("jpg", "webp") || null;
}

// Artwork types in backdrop order: key art (logo-free), key art, 16:9 banners
const BACKDROP_TYPES = [2, 3, 1, 4];
// Below this source width, a full-screen backdrop looks visibly blurry
const MIN_BACKDROP_WIDTH = 1280;

// Wide art for backdrops: prefer sharp artworks by type, then a sharp
// screenshot, then the widest image available, then the cover
function pickBackdrop(game, size = "t_1080p") {
  const artworks = game?.artworks || [];
  const screenshots = game?.screenshots || [];
  // Older cached data may lack width; treat unknown as sharp enough
  const isSharp = (img) => !img.width || img.width >= MIN_BACKDROP_WIDTH;
  const sharpArt = artworks.filter(isSharp);
  const art =
    BACKDROP_TYPES.map((type) =>
      sharpArt.find((a) => a.artwork_type === type),
    ).find(Boolean) ||
    sharpArt[0] ||
    screenshots.find(isSharp) ||
    [...artworks, ...screenshots].sort(
      (a, b) => (b.width || 0) - (a.width || 0),
    )[0];
  const coverUrl =
    typeof game?.cover === "string" ? game.cover : game?.cover?.url;
  return formatIGDBImage(art?.url || coverUrl, size);
}

function coverUrlOf(game, size = "t_cover_big") {
  const url = typeof game?.cover === "string" ? game.cover : game?.cover?.url;
  return formatIGDBImage(url, size);
}

export { formatIGDBImage, pickBackdrop, coverUrlOf };
