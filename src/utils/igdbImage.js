function formatIGDBImage(url, size) {
  return url?.replace("t_thumb", size)?.replace("jpg", "webp") || null;
}

// Wide art for backdrops: prefer real artworks, then a screenshot, then the cover
function pickBackdrop(game, size = "t_1080p") {
  const artworks = game?.artworks;
  const art =
    artworks?.find((a) => a.artwork_type === 2) ||
    artworks?.find((a) => a.artwork_type === 3) ||
    artworks?.find((a) => a.artwork_type === 1) ||
    artworks?.find((a) => a.artwork_type === 4) ||
    artworks?.[0] ||
    game?.screenshots?.[0];
  const coverUrl =
    typeof game?.cover === "string" ? game.cover : game?.cover?.url;
  return formatIGDBImage(art?.url || coverUrl, size);
}

function coverUrlOf(game, size = "t_cover_big") {
  const url = typeof game?.cover === "string" ? game.cover : game?.cover?.url;
  return formatIGDBImage(url, size);
}

export { formatIGDBImage, pickBackdrop, coverUrlOf };
