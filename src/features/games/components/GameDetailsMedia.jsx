import { useRef, useState } from "react";
import { Play } from "lucide-react";
import RowScrollButtons from "@/ui/RowScrollButtons";
import { useRowScroll } from "@/hooks/useRowScroll";
import { formatIGDBImage } from "@/utils/igdbImage";
import MediaLightbox from "./MediaLightbox";

// Trailers first, then screenshots, in one snapping 16:9 rail. Any slide opens
// the lightbox at that item, and closing it brings the rail to wherever the
// viewer was left.
function GameDetailsMedia({ data }) {
  const { screenshots, videos, name } = data[0];
  const [openIndex, setOpenIndex] = useState(null);
  const lastIndex = useRef(0);
  const row = useRowScroll((videos?.length || 0) + (screenshots?.length || 0));
  if (!screenshots?.length && !videos?.length) return null;

  const items = [
    ...(videos ?? []).map((video) => ({
      type: "video",
      id: video.id,
      videoId: video.video_id,
      thumb: `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`,
      alt: `${name} ${video.name ?? "trailer"}`,
    })),
    ...(screenshots ?? []).map((screenshot, index) => ({
      type: "image",
      id: screenshot.id,
      src: formatIGDBImage(screenshot?.url, "t_1080p"),
      thumb: formatIGDBImage(screenshot?.url, "t_1080p"),
      alt: `${name} screenshot ${index + 1}`,
    })),
  ];

  function handleIndexChange(next) {
    if (next !== null) lastIndex.current = next;
    setOpenIndex(next);
  }

  // Focus the last viewed slide without the jump focus() would make, then
  // glide the rail to it; block "nearest" leaves the page itself still
  function handleClosed() {
    const slide = row.ref.current?.children[lastIndex.current];
    if (!slide) return;
    slide.focus({ preventScroll: true });
    slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

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
        {items.map((item, index) => (
          <button
            key={`${item.type}-${item.id}`}
            type="button"
            onClick={() => handleIndexChange(index)}
            aria-label={`Open ${item.alt}`}
            className="group bg-bg-surface focus-visible:ring-pulse-primary relative aspect-video w-[85%] shrink-0 cursor-pointer snap-start overflow-hidden rounded-lg outline-none focus-visible:ring-2 sm:w-[60%] lg:w-[44%]"
          >
            <img
              src={item.thumb}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover brightness-90 transition-[filter,transform] duration-300 ease-out group-hover:scale-[1.02] group-hover:brightness-100"
            />
            {item.type === "video" && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-200 ease-out group-hover:scale-110">
                  <Play className="ml-0.5 h-6 w-6 fill-current" />
                </span>
              </span>
            )}
          </button>
        ))}
      </div>
      <MediaLightbox
        items={items}
        index={openIndex}
        onIndexChange={handleIndexChange}
        onClosed={handleClosed}
        title={name}
      />
    </section>
  );
}

export default GameDetailsMedia;
