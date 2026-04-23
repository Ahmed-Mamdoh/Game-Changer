function formatIGDBImage(url, size) {
  return url?.replace("t_thumb", size)?.replace("jpg", "webp") || null;
}

export { formatIGDBImage };
