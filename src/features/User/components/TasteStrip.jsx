import { Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const ratingOf = (userGame) =>
  userGame?.game?.reviews?.find((r) => r.user_id === userGame.user_id)?.rating;

const shortGenre = (name) => name.split("(")[0].trim();

// How you rate and what you play, in one slim row. Genre chips filter the library.
function TasteStrip({ userGames = [], genres = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get("genre");

  const ratings = userGames.map(ratingOf).filter(Boolean);
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (star) => ratings.filter((r) => Math.round(r) === star).length,
  );
  const maxCount = Math.max(...ratingCounts, 1);
  const average = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : null;

  const genreCounts = userGames
    .filter((g) => g.status !== "to play")
    .flatMap((g) => g.game?.genres || [])
    .reduce((acc, name) => ({ ...acc, [name]: (acc[name] || 0) + 1 }), {});
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    // genres is IGDB's list; a failed fetch hands back an error object instead
    .map(
      ([name]) =>
        Array.isArray(genres) && genres.find((genre) => genre.name === name),
    )
    .filter(Boolean);

  if (!ratings.length && !topGenres.length) return null;

  function toggleGenre(id) {
    const next = new URLSearchParams(searchParams);
    if (genreParam === String(id)) next.delete("genre");
    else next.set("genre", id);
    setSearchParams(next);
  }

  return (
    <section
      aria-label="Your taste"
      className="border-stroke-subtle bg-bg-surface flex flex-wrap items-center gap-x-8 gap-y-4 rounded-lg border px-4 py-3"
    >
      {ratings.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-text-main tabular flex items-center gap-1 text-2xl font-semibold">
              {average}
              <Star
                className="text-pulse-warning h-4 w-4 fill-current"
                aria-hidden="true"
              />
            </span>
            <span className="text-text-dim tabular text-xs">
              avg of {ratings.length} rated
            </span>
          </div>
          <ol aria-label="Ratings by stars" className="flex items-end gap-1.5">
            {ratingCounts.map((count, i) => (
              <li
                key={i}
                title={`${i + 1} star: ${count}`}
                className="flex w-5 flex-col items-center gap-1"
              >
                <span className="flex h-10 w-full items-end">
                  <span
                    className="bg-pulse-primary w-full rounded-sm"
                    style={{
                      height: `${Math.max((count / maxCount) * 100, 8)}%`,
                      opacity: count ? 1 : 0.2,
                    }}
                  />
                </span>
                <span className="text-text-muted tabular text-[10px] leading-none">
                  {i + 1}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {topGenres.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-dim text-sm">You play</span>
          {topGenres.map((genre) => {
            const isActive = genreParam === String(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleGenre(genre.id)}
                className={`h-8 cursor-pointer rounded-full px-3 text-sm transition-colors duration-100 ${
                  isActive
                    ? "bg-action text-on-action font-semibold"
                    : "bg-bg-chip text-text-main hover:bg-white/[0.12]"
                }`}
              >
                {shortGenre(genre.name)}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TasteStrip;
