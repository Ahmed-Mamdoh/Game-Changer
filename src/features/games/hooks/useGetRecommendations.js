import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { useEffect, useState } from "react";
import { chatWithGroq } from "@/api/groqApi";
import { useQuery } from "@tanstack/react-query";
import { UserToken } from "@/hooks/useUserToken";
import { getAllGames } from "../../../api/igdbApi";

export function useGetRecommendations() {
  const user_id = UserToken()?.user?.id;
  const userGames = useGetUserGames(user_id);
  const userGamesData =
    userGames?.data?.user_games?.map((game) => ({
      game_name: game.game.name,
      hours_played: game.hours_played,
      review: game.game.reviews?.[0]?.review || "No review",
      rating: game.game.reviews?.[0]?.rating || "No rating",
    })) || [];

  const userGamesContext =
    userGamesData.length > 0
      ? `The user's library contains: ${userGamesData.map((g) => `${g.game_name} (${g.hours_played}h, Rated: ${g.rating}, Review: ${g.review})`).join(", ")}.`
      : "The user's library is currently empty.";

  const getSystemPrompt = (
    context,
  ) => `You are a specialized AI assistant for a gaming website called Game Changer.
      Your role is to help PC gamers discover games that match their preferences while being friendly, concise, and knowledgeable.
      
      CONTEXT (Games the user has already played/owns):
      ${context}
      
      Use this data to provide highly personalized base game recommendations. Analyze their hours played, ratings, and specific reviews to understand their taste. If they have many hours in a game or rated it highly, suggest similar base games. If their library is empty, suggest popular starters.

      RULES:
        - return 10 games names with the match percentage and a short reason for recommendation.
        - The match percentage is be between 0 and 100.
        - return the data as a JSON array of objects with keys: "game_name", "match_percentage", and "reason".
        - EXCLUSION RULE: STRICTLY FORBIDDEN to recommend any games listed in the "CONTEXT" section above. Your goal is to find NEW games for the user.
        - Suggest only base games. Use ONLY the primary title. Do NOT include suffixes like "Complete Edition", "GOTY", "Deluxe Edition", "Gold Edition", "Remastered", etc.
        - Do not include DLCs, expansions, or add-ons.
        - DATE RESTRICTION: Do not recommend any games released before the year 2005. Only recommend modern or semi-modern titles.
`;
  const models = [
    "openai/gpt-oss-120b", // Aug 2025
    "moonshotai/kimi-k2-instruct-0905", // Sept 2025
    "openai/gpt-oss-safeguard-20b", // Oct 2025
    "groq/compound", // Sept 2025
    "groq/compound-mini", // Sept 2025
    "openai/gpt-oss-20b", // Aug 2025
    "meta-llama/llama-guard-4-12b", // May 2025
    "meta-llama/llama-prompt-guard-2-22m", // May 2025
    "meta-llama/llama-prompt-guard-2-86m", // May 2025
    "meta-llama/llama-4-maverick-17b-128e-instruct", // Apr 2025
    "meta-llama/llama-4-scout-17b-16e-instruct", // Apr 2025
    "llama-3.3-70b-versatile", // Dec 2024
    "llama-3.1-8b-instant", // Sept 2023
  ];

  const [messages, setMessages] = useState([
    {
      role: "system",
      content: getSystemPrompt(userGamesContext),
    },
  ]);

  // Update system prompt when library data loads
  useEffect(() => {
    if (userGames.isLoading) return;

    setMessages((prev) => {
      const newMessages = [...prev];
      newMessages[0] = {
        role: "system",
        content: getSystemPrompt(userGamesContext),
      };
      return newMessages;
    });
  }, [userGamesContext, userGames.isLoading]);

  const {
    data: recommendations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recommendations", messages[0].content],
    queryFn: async () => {
      if (localStorage.getItem("recommendations"))
        return JSON.parse(localStorage.getItem("recommendations"));
      const response = await chatWithGroq({
        model: models[0],
        messages,
      });

      if (response === "error") throw new Error("Failed to fetch from Groq");

      try {
        // AI might wrap JSON in markdown code blocks like ```json ... ```
        const cleanedContent = response.content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const aiRecommendations = JSON.parse(cleanedContent);

        // Fetch IGDB data for each recommended game
        const gamePromises = aiRecommendations.map(async (rec) => {
          try {
            const igdbResults = await getAllGames({
              search: rec.game_name,
              isReleased: true,
              limit: 1,
            });
            if (igdbResults && igdbResults.length > 0) {
              const game = igdbResults[0];
              return {
                ...game,
                matchScore: rec.match_percentage,
                recommendationReason: rec.reason ? rec.reason : "", // GameItem expects a string
              };
            }
          } catch (err) {
            console.error(
              `Failed to fetch IGDB data for ${rec.game_name}:`,
              err,
            );
          }
          return null;
        });

        const gamesWithData = await Promise.all(gamePromises);
        localStorage.setItem(
          "recommendations",
          JSON.stringify(
            gamesWithData
              .filter((g) => g !== null)
              .sort((a, b) => b.matchScore - a.matchScore)
              .slice(0, 6),
          ),
        );
        return gamesWithData
          .filter((g) => g !== null)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 6);
      } catch (e) {
        console.error("Failed to parse AI response as JSON:", e);
        console.log("Raw content:", response.content);
        throw new Error("Invalid response format from AI");
      }
    },
    enabled: !!userGamesContext && !userGames.isLoading,
  });

  return {
    recommendations,
    isLoading,
    error,
  };
}
