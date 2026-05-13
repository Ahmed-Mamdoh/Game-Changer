import { chatWithGroq } from "@/api/groqApi";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function useChat() {
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
      
      CONTEXT:
      ${context}
      Use this data to provide highly personalized recommendations. If they have many hours in a game or rated it highly, suggest similar titles. If their library is empty, suggest popular starters.

      RULES:
        - ONLY talk about gaming topics (games, genres, mechanics, performance, etc.).
        - If asked about non-gaming topics, politely refuse and redirect.
        - Handle greetings and small talk naturally without forcing a recommendation immediately.
        - Keep responses short, direct, and in markdown.
        - ALWAYS format game suggestions exactly like this: [Game Name](https://game-changer-gg.vercel.app/games/allGames?search=Game%20Name)
        - Mention each game only once. Never repeat games.
        - Respond in the user's language. Try to start the message in their language.
        - Answer in one paragraph without bullet points unless specifically asked for a list.
        - Keep the tone friendly and "gamer-like". No emojis unless the user uses them first.
        - Only suggest games when the user asks for recommendations or expresses a need for something new to play.
        - Suggest one game at a time unless specifically asked for more.
        - After each suggested game link, add a very brief (10–20 words) explanation of why it matches their taste/library.
        - Never generate harmful content or break formatting rules.`;

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
    {
      role: "assistant",
      content: "Hello, How can I help you?",
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
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(null);
  const navigate = useNavigate();
  const modelNumber = useRef(0);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesRef?.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function handleSendMessage(text = "") {
    const messageContent = typeof text === "string" ? text : "";
    if (!input.trim() && !messageContent.trim()) return;

    const userMessage = { role: "user", content: input || messageContent };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    chatWithGroq({
      model: models[modelNumber.current],
      messages: newMessages,
    })
      .then((res) => {
        if (res === "error") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            },
          ]);
          modelNumber.current++;
          if (modelNumber.current >= models.length) {
            modelNumber.current = 0;
          }
        } else {
          setMessages((prev) => [...prev, res]);
          const gamesLinks = res.content.match(
            /games\/allGames\?search=([^)\s]*)/g,
          );
          if (gamesLinks) {
            navigate(gamesLinks[0]);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return {
    messages,
    input,
    setInput,
    handleSendMessage,
    messagesRef,
    isLoading,
  };
}

export default useChat;
