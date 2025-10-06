import { useSearchParams } from "react-router-dom";
import { Combobox } from "@/components/ui/combobox";
import { FaUndoAlt } from "react-icons/fa";
import { useGetGenres } from "../hooks/useGetGenres";
import { useGetThemes } from "../hooks/useGetThemes";
import { useGetGameModes } from "../hooks/useGetGameModes";

function Filters({
  showGenres = true,
  showThemes = true,
  showSortBy = true,
  showGameModes = true,
  showStatus = false,
  isAccount = false,
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
      className={`bg-base-300 mx-auto rounded-2xl px-2 py-4 shadow-md ${className}`}
    >
      <div className="container flex flex-col flex-wrap items-start justify-between gap-x-8 gap-y-4 px-2 sm:flex-row">
        {showGenres && (
          <div className="flex w-full items-center justify-between gap-x-2 sm:w-fit sm:justify-center">
            <label className="text-lg">Genres:</label>
            <Combobox options={genres} paramName="genre" />
          </div>
        )}

        {showThemes && (
          <div className="flex w-full items-center justify-between gap-x-2 sm:w-fit sm:justify-center">
            <label className="text-lg">Themes:</label>
            <Combobox options={themes} paramName="theme" />
          </div>
        )}

        {showGameModes && (
          <div className="flex w-full items-center justify-between gap-x-2 sm:w-fit sm:justify-center">
            <label className="text-lg">Mode:</label>
            <Combobox options={gameModes} paramName="gameMode" />
          </div>
        )}

        {showStatus && (
          <div className="flex w-full items-center justify-between gap-x-2 sm:w-fit sm:justify-center">
            <label className="text-lg">Status:</label>
            <Combobox options={status} paramName="status" />
          </div>
        )}

        {!search && showSortBy && (
          <div className="flex w-full items-center justify-between gap-x-2 sm:w-fit sm:justify-center">
            <label className="text-lg">Sort By:</label>
            <Combobox options={sortBy} paramName="sortBy" />
          </div>
        )}

        <button
          onClick={() => {
            const newParams = new URLSearchParams();
            setSearchParams(newParams);
          }}
          className="bg-secondary text-secondary-content group cursor-pointer rounded-sm font-extrabold transition-all duration-200 hover:rounded-lg"
        >
          <div className="flex items-center gap-x-2 px-4 py-2">
            <FaUndoAlt className="transition-transform duration-200 group-hover:-rotate-90" />
            <span>Reset</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Filters;
