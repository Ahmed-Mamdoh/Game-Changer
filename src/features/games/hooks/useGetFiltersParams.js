import { useSearchParams } from "react-router-dom";

function useGetFiltersParams() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page")) || 1;
  const genre = searchParams.get("genre");
  const themes = searchParams.get("theme");
  const gameMode = searchParams.get("gameMode");
  const sortBy = search ? null : searchParams.get("sortBy");
  let filters = [];
  if (genre) {
    filters.push(`genres = [${genre.split("-")}]`);
  }
  if (themes) {
    filters.push(`themes = [${themes.split("-")}]`);
  }
  if (gameMode) {
    filters.push(`game_modes = (${gameMode.split("-")})`);
  }
  return { filters, sortBy, page, search };
}

export default useGetFiltersParams;
