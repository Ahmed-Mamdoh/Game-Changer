import { useSearchParams } from "react-router-dom";
import { Combobox } from "@/components/ui/combobox";
import { FaUndoAlt } from "react-icons/fa";
import { useGetGenres } from "../hooks/useGetGenres";
import { useGetThemes } from "../hooks/useGetThemes";
import { useGetGameModes } from "../hooks/useGetGameModes";
import { memo } from "react";
import FilterButtons from "./FilterButtons";

function Filters({
  showGenres = true,
  showThemes = true,
  showSortBy = true,
  showGameModes = true,
  showStatus = false,
  isAccount = false,
  showFavorite = false,
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
    : [
        { id: "first_release_date", name: "Release Date" },
        { id: "total_rating_count", name: "Popularity" },
      ];
  const status = [
    { id: "finished", name: "Finished" },
    { id: "playing", name: "Playing" },
    { id: "dropped", name: "Dropped" },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");

  if (isLoadingGenres || isLoadingThemes || isLoadingGameModes) return null;
  return (
    <div
      className={`bg-obsidian-base/20 mx-auto w-9/10 rounded-xl px-2 py-4 shadow-lg backdrop-blur-sm ${className}`}
    >
      <div className="container flex flex-col flex-wrap items-start justify-between gap-x-8 gap-y-4 px-2 sm:flex-row">
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

          {!search && showSortBy && (
            <FilterButtons
              category={sortBy}
              name="Sort By"
              paramName="sortBy"
              or={true}
              defaultValue={["total_rating_count"]}
            />
          )}
          <button
            onClick={() => {
              const newParams = new URLSearchParams();
              setSearchParams(newParams);
            }}
            className="bg-pulse-secondary text-secondary-content group cursor-pointer rounded-full font-extrabold transition-all duration-200"
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
