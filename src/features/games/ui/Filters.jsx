import { memo } from "react";
import { FaUndoAlt } from "react-icons/fa";
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
        { id: "hours_played", name: "Hours Played" },
        { id: "date_finished", name: "Date Finished" },
      ]
    : isUpcoming
      ? [
          { id: "first_release_date", name: "Release Date" },
          { id: "hypes", name: "Hype" },
        ]
      : [
          { id: "first_release_date", name: "Release Date" },
          { id: "total_rating_count", name: "Popularity" },
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

  if (isLoadingGenres || isLoadingThemes || isLoadingGameModes) return null;
  return (
    <div
      className={`bg-bg-card border-stroke-medium mx-auto w-9/10 rounded-xl border bg-linear-to-br from-white/5 to-transparent px-2 py-4 shadow-2xl backdrop-blur-xl ${className}`}
    >
      <div className="flex flex-col flex-wrap items-start justify-between gap-x-8 gap-y-4 px-2 sm:flex-row">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
          {showGenres && (
            <FilterButtons category={genres} name="Genres" paramName="genre" />
          )}

          {showThemes && (
            <FilterButtons category={themes} name="Themes" paramName="theme" />
          )}

          {showGameModes && (
            <FilterButtons
              category={gameModes}
              name="Mode"
              paramName="gameMode"
            />
          )}

          {showStatus && (
            <FilterButtons category={status} name="Status" paramName="status" />
          )}

          {showPerspective && (
            <FilterButtons
              category={perspectives}
              defaultValue={["all"]}
              or={true}
              sort={false}
              name="Perspective"
              paramName="player_perspectives"
            />
          )}

          {showPlatform && (
            <FilterButtons
              category={platforms}
              name="Platform"
              paramName="platform"
              defaultValue={["all"]}
              sort={false}
              or={true}
            />
          )}

          {!search && showSortBy && (
            <FilterButtons
              category={sortBy}
              name="Sort By"
              paramName="sortBy"
              or={true}
              defaultValue={isUpcoming ? ["hypes"] : ["total_rating_count"]}
            />
          )}
          <button
            onClick={() => {
              const newParams = new URLSearchParams();
              setSearchParams(newParams);
            }}
            className="bg-pulse-primary  group cursor-pointer rounded-full font-bold transition-all duration-200"
          >
            <div className="flex items-center gap-x-2 px-4 py-2">
              <FaUndoAlt className="transition-transform duration-200 group-hover:-rotate-90" />
              <span>Reset</span>
            </div>
          </button>

          {showFavorite && (
            <div className="flex w-5/12 items-center justify-start gap-x-2">
              <label htmlFor="isFavorite" className="text-lg">
                Favorites:
              </label>
              <input
                id="isFavorite"
                type="checkbox"
                className="toggle toggle-error"
                checked={searchParams.get("isFavorite") === "true"}
                onChange={(e) => {
                  if (e.target.checked) {
                    searchParams.set("isFavorite", "true");
                  } else {
                    searchParams.delete("isFavorite");
                  }
                  setSearchParams(searchParams);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Filters);
