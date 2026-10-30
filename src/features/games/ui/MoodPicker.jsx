import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MOODS, moodOf, withoutMood } from "../moods";

// One mood at a time, stored in the URL as `mood=<key>`. Pressing the picked
// mood again, or Any mood, goes back to every game. Phones scroll the row.
function MoodPicker({ className = "" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const picked = moodOf(searchParams.get("mood"));
  const rowRef = useRef(null);

  // On phones a mood picked from the home page can sit past the edge
  useEffect(() => {
    rowRef.current
      ?.querySelector('[aria-pressed="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [picked?.key]);

  function pick(mood) {
    if (!mood || mood.key === picked?.key) {
      setSearchParams(withoutMood(searchParams));
      return;
    }
    const next = withoutMood(searchParams);
    next.set("mood", mood.key);
    setSearchParams(next);
  }

  const chip = (on) =>
    `flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors duration-100 ${
      on
        ? "border-stroke-brand bg-pulse-primary/10 text-text-main font-semibold"
        : "border-stroke-subtle text-text-dim hover:text-text-main hover:bg-white/[0.04]"
    }`;

  return (
    <div className={className}>
      <div
        ref={rowRef}
        role="group"
        aria-label="Mood"
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5 md:mx-0 md:flex-wrap md:px-0"
      >
        <button
          type="button"
          aria-pressed={!picked}
          onClick={() => pick(null)}
          className={chip(!picked)}
        >
          Any mood
        </button>
        {MOODS.map((mood) => {
          const on = mood.key === picked?.key;
          return (
            <button
              key={mood.key}
              type="button"
              aria-pressed={on}
              onClick={() => pick(mood)}
              className={chip(on)}
            >
              <mood.icon
                className={`h-4 w-4 shrink-0 ${on ? "text-text-brand" : ""}`}
                aria-hidden="true"
              />
              {mood.name}
            </button>
          );
        })}
      </div>
      {picked && <p className="text-text-dim mt-2.5 text-sm">{picked.note}</p>}
    </div>
  );
}

export default MoodPicker;
