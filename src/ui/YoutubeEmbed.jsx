function YoutubeEmbed({ videoId, autoplay = false }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="h-full w-full"
    />
  );
}
export default YoutubeEmbed;
