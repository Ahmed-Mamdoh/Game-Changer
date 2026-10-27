import YoutubeEmbed from "@/ui/YoutubeEmbed";
import RowScrollButtons from "@/ui/RowScrollButtons";
import { useRowScroll } from "@/hooks/useRowScroll";
import { formatIGDBImage } from "@/utils/igdbImage";

// Trailers first, then screenshots, in one snapping 16:9 rail
function GameDetailsMedia({ data }) {
  const { screenshots, videos, name } = data[0];
  const row = useRowScroll((videos?.length || 0) + (screenshots?.length || 0));
  if (!screenshots?.length && !videos?.length) return null;

  const slide =
    "aspect-video w-[85%] shrink-0 snap-start overflow-hidden rounded-lg sm:w-[60%] lg:w-[44%]";

  return (
    <section
      id="Media"
      aria-label="Media"
      className="mx-auto w-full max-w-[1440px] px-4 pt-14 md:px-8"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2>Media</h2>
        <RowScrollButtons label="media" {...row} />
      </div>
      <div
        ref={row.ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:scroll-px-8 md:px-8"
      >
        {videos?.map((video) => (
          <div key={video.id} className={`${slide} bg-black`}>
            <YoutubeEmbed videoId={video.video_id} />
          </div>
        ))}
        {screenshots?.map((screenshot, index) => (
          <div key={screenshot.id} className={`${slide} bg-bg-surface`}>
            <img
              src={formatIGDBImage(screenshot?.url, "t_1080p")}
              alt={`${name} screenshot ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover brightness-90"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default GameDetailsMedia;
