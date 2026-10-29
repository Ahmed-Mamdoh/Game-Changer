import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import YoutubeEmbed from "@/ui/YoutubeEmbed";

const arrow =
  "absolute bottom-6 z-10 inline-flex h-11 w-11 cursor-pointer md:top-1/2 md:bottom-auto md:-translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-[background-color,transform] duration-150 ease-out hover:bg-white active:scale-95 md:h-12 md:w-12";

// Near-fullscreen viewer over a dimmed page. Arrows (at the sides, or under
// the media on phones where they'd cover the player), ←/→ and swipes step
// through every item and wrap at the ends; Esc, X or a click on the backdrop
// closes. `index` is null while closed.
function MediaLightbox({ items, index, onIndexChange, title }) {
  const touchX = useRef(null);
  const open = index !== null;
  const count = items.length;
  const item = open ? items[index] : null;

  const step = (dir) => onIndexChange((index + dir + count) % count);

  // Warm the neighbours so stepping never waits on the network
  useEffect(() => {
    if (!open) return;
    [-1, 1].forEach((dir) => {
      const next = items[(index + dir + count) % count];
      if (next.type === "image") new Image().src = next.src;
    });
  }, [open, index, items, count]);

  function handleKeyDown(e) {
    if (count < 2) return;
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  }

  function handleTouchEnd(e) {
    if (touchX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        onKeyDown={handleKeyDown}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.target === e.currentTarget && onIndexChange(null)}
        overlayClassName="confirm-overlay bg-black/90 backdrop-blur-sm"
        className="lightbox-panel inset-0 top-0 left-0 flex h-dvh max-w-none translate-x-0 translate-y-0 items-center justify-center gap-0 rounded-none border-0 bg-transparent px-4 py-16 shadow-none sm:max-w-none md:px-24"
      >
        <DialogTitle className="sr-only">{title} media</DialogTitle>

        <p className="text-text-muted absolute top-5 left-5 text-sm tabular-nums md:left-8">
          {index + 1} / {count}
        </p>
        <DialogClose
          className="text-text-main absolute top-3 right-3 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ease-out hover:bg-white/10 md:right-6"
          aria-label="Close media viewer"
        >
          <XIcon className="h-6 w-6" />
        </DialogClose>

        {item && (
          <div
            key={index}
            className="lightbox-slide aspect-video w-full max-w-[min(1600px,calc((100dvh-8rem)*16/9))] overflow-hidden rounded-lg bg-black"
          >
            {item.type === "video" ? (
              <YoutubeEmbed videoId={item.videoId} autoplay />
            ) : (
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-contain"
              />
            )}
          </div>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              className={`${arrow} left-[calc(50%-3.25rem)] md:left-6`}
              onClick={() => step(-1)}
              aria-label="Previous media"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className={`${arrow} right-[calc(50%-3.25rem)] md:right-6`}
              onClick={() => step(1)}
              aria-label="Next media"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MediaLightbox;
