import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetGameModes } from "../hooks/useGetGameModes";
import { useGetGenres } from "../hooks/useGetGenres";
import { useGetThemes } from "../hooks/useGetThemes";
import FilterButtons from "./FilterButtons";

function Filters({
  showGenres = true,
  showThemes = true,
  showSortBy = true,
  showGameModes = true,
  showStatus = false,
  isAccount = false,
  showFavorite = false,
  isUpcoming = false,
  showPlatform = true,
  showPerspective = true,
  className = "",
}) {
  const { data: genres, isLoading: isLoadingGenres } = useGetGenres();
  const { data: themes, isLoading: isLoadingThemes } = useGetThemes();
  const { data: gameModes, isLoading: isLoadingGameModes } = useGetGameModes();
  const sortBy = isAccount
    ? [
        { id: "hours_played", name: "Hours played" },
        { id: "date_finished", name: "Date finished" },
      ]
    : isUpcoming
      ? [
          { id: "hypes", name: "Most hyped" },
          { id: "first_release_date", name: "Soonest" },
        ]
      : [
          { id: "total_rating_count", name: "Popular" },
          { id: "first_release_date", name: "Newest" },
        ];
  const status = [
    { id: "finished", name: "Finished" },
    { id: "playing", name: "Playing" },
    { id: "dropped", name: "Dropped" },
  ];
  const platforms = [
    { id: "all", name: "All" },
    { id: "6", name: "PC" },
    { id: "48", name: "PlayStation 4" },
    { id: "167", name: "PlayStation 5" },
    { id: "49", name: "Xbox One" },
    { id: "169", name: "Xbox Series X|S" },
    { id: "130", name: "Nintendo Switch" },
  ];
  const perspectives = [
    { id: "all", name: "All" },
    { id: "1", name: "First person" },
    { id: "2", name: "Third person" },
    { id: "3", name: "Bird view / Isometric" },
    { id: "4", name: "Side view" },
    { id: "5", name: "Text" },
    { id: "6", name: "Auditory" },
    { id: "7", name: "Virtual Reality" },
    { id: "8", name: "Augmented Reality" },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");

  const hasActive = [...searchParams.keys()].some(
    (key) => !["page", "search"].includes(key),
  );

  if (isLoadingGenres || isLoadingThemes || isLoadingGameModes)
    return <div className={`h-10 ${className}`} />;

  return (
    <div
      className={`no-scrollbar mx-auto flex w-full max-w-[1440px] items-center gap-2 overflow-x-auto px-4 md:flex-wrap md:px-8 ${className}`}
    >
      {!search && showSortBy && (
        <FilterButtons
          category={sortBy}
          name="Sort by"
          paramName="sortBy"
          or={true}
          sort={false}
          variant="segmented"
          defaultValue={
            isAccount ? [] : isUpcoming ? ["hypes"] : ["total_rating_count"]
          }
        />
      )}

      {showGenres && (
        <FilterButtons category={genres} name="Genre" paramName="genre" />
      )}
      {showThemes && (
        <FilterButtons category={themes} name="Theme" paramName="theme" />
      )}
      {showGameModes && (
        <FilterButtons category={gameModes} name="Mode" paramName="gameMode" />
      )}
      {showStatus && (
        <FilterButtons category={status} name="Status" paramName="status" />
      )}
      {showPlatform && (
        <FilterButtons
          category={platforms.filter((p) => p.id !== "all")}
          name="Platform"
          paramName="platform"
          sort={false}
          or={true}
        />
      )}
      {showPerspective && (
        <FilterButtons
          category={perspectives.filter((p) => p.id !== "all")}
          name="Perspective"
          paramName="player_perspectives"
          sort={false}
          or={true}
        />
      )}

      {showFavorite && (
        <label className="border-stroke-subtle text-text-dim has-checked:text-text-main has-checked:border-stroke-brand flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm">
          <input
            type="checkbox"
            className="accent-pulse-primary h-4 w-4"
            checked={searchParams.get("isFavorite") === "true"}
            onChange={(e) => {
              if (e.target.checked) searchParams.set("isFavorite", "true");
              else searchParams.delete("isFavorite");
              setSearchParams(searchParams);
            }}
          />
          Favorites only
        </label>
      )}

      {hasActive && (
        <button
          type="button"
          onClick={() => {
            const newParams = new URLSearchParams();
            if (search) newParams.set("search", search);
            setSearchParams(newParams);
          }}
          className="text-text-brand h-10 cursor-pointer px-2 text-sm font-semibold hover:underline hover:underline-offset-4"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default memo(Filters);
