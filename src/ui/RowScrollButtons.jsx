import { ChevronLeft, ChevronRight } from "lucide-react";

const btn =
  "border-stroke-medium bg-bg-raised text-text-main hover:bg-bg-chip inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-colors duration-150 ease-out disabled:cursor-default disabled:opacity-35 disabled:hover:bg-bg-raised";

// Prev/next pair for a row header. Mouse users only; touch keeps swiping.
// Hidden entirely when the row fits without scrolling.
function RowScrollButtons({ label, canPrev, canNext, page }) {
  if (!canPrev && !canNext) return null;

  return (
    <div className="hidden shrink-0 items-center gap-2 pointer-fine:flex">
      <button
        type="button"
        className={btn}
        disabled={!canPrev}
        onClick={() => page(-1)}
        aria-label={`Scroll ${label} left`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={btn}
        disabled={!canNext}
        onClick={() => page(1)}
        aria-label={`Scroll ${label} right`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default RowScrollButtons;
