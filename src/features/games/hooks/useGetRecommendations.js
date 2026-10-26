import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { chatWithGroq } from "@/api/groqApi";
import { useQuery } from "@tanstack/react-query";
import { UserToken } from "@/hooks/useUserToken";
import { searchReleasedGamesByName } from "@/api/igdbApi";
import { findExactGameMatch } from "@/utils/gameNameMatching";

const CACHE_PREFIX = "recommendations:";
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day
const PICKS_TO_SHOW = 6;

// Cheap string hash so the cache can tell when the library changed.
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function readCache(user_id, libraryHash) {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_PREFIX + user_id));
    if (
      cached?.libraryHash === libraryHash &&
      Date.now() - cached.createdAt < CACHE_MAX_AGE &&
      Array.isArray(cached.picks)
    )
      return cached.picks;
  } catch {
    // Unreadable cache, fall through to a fresh fetch
  }
  return null;
}

function writeCache(user_id, libraryHash, picks) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + user_id,
      JSON.stringify({ libraryHash, createdAt: Date.now(), picks }),
    );
  } catch {
    // Storage full or blocked, picks still show for this visit
  }
}

function clearCache(user_id) {
  try {
    localStorage.removeItem(CACHE_PREFIX + user_id);
  } catch {
    // Nothing to clear
  }
}

// The old cache key was shared by every account on the browser.
try {
  localStorage.removeItem("recommendations");
} catch {
  // Storage blocked
}

const getSystemPrompt = (
  context,
) => `You are a specialized AI assistant for a gaming website called Game Changer.
      Your role is to help PC gamers discover games that match their preferences while being friendly, concise, and knowledgeable.

      CONTEXT (Games the user has already played/owns):
      ${context}

      Use this data to provide highly personalized base game recommendations. Analyze their hours played, ratings, specific reviews, and whether they marked a game as a "Favorite" to understand their taste. If they have many hours in a game, rated it highly, or marked it as a favorite, suggest similar base games. Favor games that align with their favorites. If their library is empty, suggest popular starters.

      RULES:
        - return 10 games names with their original release year, the match percentage and a short reason for recommendation.
        - The match percentage is be between 0 and 100.
        - return the data as a JSON array of objects with keys: "game_name", "release_year", "match_percentage", and "reason".
        - "game_name" must be the exact official title as listed on IGDB, and "release_year" a 4-digit number.
        - EXCLUSION RULE: STRICTLY FORBIDDEN to recommend any games listed in the "CONTEXT" section above. Your goal is to find NEW games for the user.
        - Suggest only base games. Use ONLY the primary title. Do NOT include suffixes like "Complete Edition", "GOTY", "Deluxe Edition", "Gold Edition", "Remastered", etc.
        - Do not include DLCs, expansions, or add-ons.
        - DATE RESTRICTION: Do not recommend any games released before the year 2005. Only recommend modern or semi-modern titles.
`;

const MODEL = "openai/gpt-oss-120b";

export function useGetRecommendations() {
  const user_id = UserToken()?.user?.id;
  const userGames = useGetUserGames(user_id);
  const libraryGames = userGames?.data?.user_games || [];
  const libraryIds = libraryGames.map((game) => game.game.game_id);

  const userGamesData = libraryGames
    .filter((game) => game.status !== "to play")
    .map((game) => ({
      game_name: game.game.name,
      hours_played: game.hours_played,
      review: game.game.reviews?.[0]?.review || "No review",
      rating: game.game.reviews?.[0]?.rating || "No rating",
      is_favorite: game.is_favorite,
    }));
  const userGamesContext =
    userGamesData.length > 0
      ? `The user's library contains: ${userGamesData.map((g) => `${g.game_name} (Favorite: ${g.is_favorite}, hours played: ${g.hours_played}h, Rated: ${g.rating}, Review: ${g.review})`).join(", ")}.`
      : "The user's library is currently empty.";

  // Any change to the library (games, hours, ratings, reviews, favorites, or
  // games added to "to play") gives a new hash, so picks are rebuilt.
  const libraryHash = hashString(
    userGamesContext + "|" + [...libraryIds].sort((a, b) => a - b).join(","),
  );

  const {
    data: recommendations,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["recommendations", user_id, libraryHash],
    queryFn: async () => {
      const cached = readCache(user_id, libraryHash);
      if (cached) return cached;

      const response = await chatWithGroq({
        model: MODEL,
        messages: [{ role: "system", content: getSystemPrompt(userGamesContext) }],
      });

      if (response === "error") throw new Error("Failed to fetch from Groq");

      let aiRecommendations;
      try {
        // AI might wrap JSON in markdown code blocks like ```json ... ```
        const cleanedContent = response.content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        aiRecommendations = JSON.parse(cleanedContent);
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", e);
        console.log("Raw content:", response.content);
        throw new Error("Invalid response format from AI");
      }

      // Resolve each title to one IGDB game. Only exact name matches (with a
      // release-year check) are kept, so a title can't turn into another game.
      const resolved = await Promise.all(
        aiRecommendations.map(async (rec) => {
          try {
            const candidates = await searchReleasedGamesByName(rec.game_name);
            const game = findExactGameMatch(
              Array.isArray(candidates) ? candidates : [],
              rec.game_name,
              rec.release_year,
            );
            if (!game) return null;
            return {
              ...game,
              matchScore: Number(rec.match_percentage) || 0,
              recommendationReason: rec.reason ? rec.reason : "", // GameItem expects a string
            };
          } catch (err) {
            console.error(
              `Failed to fetch IGDB data for ${rec.game_name}:`,
              err,
            );
            return null;
          }
        }),
      );

      // Drop anything already in the library (by IGDB id) and duplicates.
      const owned = new Set(libraryIds);
      const seen = new Set();
      const picks = resolved
        .filter((game) => {
          if (!game || owned.has(game.id) || seen.has(game.id)) return false;
          seen.add(game.id);
          return true;
        })
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, PICKS_TO_SHOW);

      writeCache(user_id, libraryHash, picks);
      return picks;
    },
    enabled: !!user_id && !userGames.isLoading && libraryGames.length > 0,
    staleTime: Infinity,
  });

  function refresh() {
    clearCache(user_id);
    return refetch();
  }

  return {
    recommendations,
    isLoading,
    isRefreshing: isFetching && !isLoading,
    error,
    refresh,
  };
}
