import {
  findBestMatchingGame,
  normalizeGameName,
} from "@/utils/gameNameMatching";
import { useGetFreeGameData } from "./useGetFreeGameData";
import { useGetFreePcGames } from "./useGetFreePcGames";

export function useGetFreeGamesToShow() {
  // get the names of the free games from gamerPower api
  const { data: freeGamesData, isLoading: isLoadingFreeGamesNames } =
    useGetFreePcGames();
  // GamerPower can answer with an error object too, and keeps ended
  // giveaways marked "Active" for a while, so drop the ones past end_date
  const freeGamesNames = Array.isArray(freeGamesData)
    ? freeGamesData.filter((game) => {
        const end = new Date(game.end_date).getTime();
        return !Number.isFinite(end) || end > Date.now();
      })
    : null;

  // clean the title to get only the name of the game
  // ex. inscryption (steam) xxxxxxx
  // gets only inscryption
  let gamesCleanNames = freeGamesNames?.map(
    (game) => game.title.split(" (")[0],
  );

  // gets the data (id,cover,name) of each game name in the gamesCleanNames array from the IGDb api
  const { data: freeGamesIgdbData, isLoading: isLoadingFreeGamesIgdbData } =
    useGetFreeGameData(gamesCleanNames || []);

  // for each free get the name of the platform that has it
  // ex. inscryption (steam) giveaway
  // gets only steam
  const freeOnPlatform = freeGamesNames?.map(
    (game) => game.title.match(/\(([^)]+)\)/)?.[1],
  );

  const dataToShow =
    Array.isArray(freeGamesIgdbData) && freeGamesIgdbData.length > 0
      ? freeGamesIgdbData
          ?.map((searchResult, i) => {
            // Use the new robust matching function
            const intendedGame = findBestMatchingGame(
              searchResult,
              gamesCleanNames[i],
            );

            // IGDB answers errors (rate limit, bad query) with an object
            if (!Array.isArray(searchResult)) return null;

            // Fallback logic if no match found
            if (!intendedGame && searchResult.length > 0) {
              // Try to find any game that contains the target name
              const containsMatch = searchResult.find((game) =>
                normalizeGameName(game.name).includes(
                  normalizeGameName(gamesCleanNames[i]),
                ),
              );

              if (containsMatch) {
                return {
                  ...containsMatch,
                  freeOn: freeOnPlatform[i],
                  endDate: freeGamesNames[i].end_date,
                  giveAwayLink: freeGamesNames[i].open_giveaway,
                };
              }

              // No real match: skip it rather than show some other game
              return null;
            }

            // Return matched game with additional data
            if (intendedGame) {
              return {
                ...intendedGame,
                freeOn: freeOnPlatform[i],
                endDate: freeGamesNames[i].end_date,
                giveAwayLink: freeGamesNames[i].open_giveaway,
              };
            }

            // If still no match, return null for this entry
            return null;
          })
          .filter(Boolean) // Remove null entries
          // Most rated first so a big game never hides behind small ones;
          // ties keep GamerPower's order (by store value)
          .sort(
            (a, b) =>
              (b.total_rating_count || 0) - (a.total_rating_count || 0) ||
              (b.hypes || 0) - (a.hypes || 0),
          )
      : [];

  return { dataToShow, isLoadingFreeGamesIgdbData, isLoadingFreeGamesNames };
}
