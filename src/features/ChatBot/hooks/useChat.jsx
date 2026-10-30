import { chatWithGroq } from "@/api/groqApi";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import { useEffect, useRef, useState } from "react";

// Chat models only, tried in order when one fails (classifier models removed)
export const CHAT_MODELS = [
  "openai/gpt-oss-120b",
  "moonshotai/kimi-k2-instruct-0905",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
];
const MAX_ATTEMPTS = 3;
// The proxy caps a request at 50 messages, so only recent turns are sent
const HISTORY_LIMIT = 20;
// The model ends a reply with this when it recommends games
const PICK_MARKER = "[[pick]]";
const PICK_LINK = /\/games\/allGames\?search=[^)\s]*/;

const GREETING = {
  role: "assistant",
  content: "Ask me what to play next, or anything about a game.",
  local: true,
};

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
        - ALWAYS format game suggestions exactly like this: [Game Name](/games/allGames?search=Game%20Name)
        - Mention each game only once. Never repeat games.
        - Respond in the user's language. Try to start the message in their language.
        - Answer in one paragraph without bullet points unless specifically asked for a list.
        - Keep the tone friendly and "gamer-like". No emojis unless the user uses them first.
        - Only suggest games when the user asks for recommendations or expresses a need for something new to play.
        - Suggest one game at a time unless specifically asked for more.
        - After each suggested game link, add a very brief (10–20 words) explanation of why it matches their taste/library.
        - When your reply recommends a game for the user to play, end it with ${PICK_MARKER} on its own line. Never add it when you only answer a question about a game.
        - Never generate harmful content or break formatting rules.`;

// Starter prompts shaped by what the user plays most
function buildStarters(games) {
  const top = [...games].sort((a, b) => b.hours_played - a.hours_played)[0];
  if (!top) {
    return [
      "Where should I start?",
      "A short game for tonight",
      "Best co-op games right now",
    ];
  }
  return [
    `Something like ${top.game_name}`,
    "A short game for tonight",
    "Best co-op games right now",
  ];
}

// onRecommend gets the first game link of a reply that recommends games
function useChat({ onRecommend } = {}) {
  const user_id = UserToken()?.user?.id;
  const isSignedIn = Boolean(user_id);
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

  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(null);
  const modelNumber = useRef(0);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesRef?.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  function addLocalReply(content) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content, local: true },
    ]);
  }

  // Starter prompts always ask for a pick
  async function handleSendMessage(text = "", { isPickRequest = false } = {}) {
    const messageContent = (typeof text === "string" && text) || input;
    if (!messageContent.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { role: "user", content: messageContent.trim() },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Local notices (greeting, errors) never reach the model
    const history = newMessages
      .filter((m) => !m.local)
      .slice(-HISTORY_LIMIT)
      .map(({ role, content }) => ({ role, content }));
    const payload = [
      { role: "system", content: getSystemPrompt(userGamesContext) },
      ...history,
    ];

    try {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const res = await chatWithGroq({
          model: CHAT_MODELS[modelNumber.current],
          messages: payload,
        });
        if (res === "unauthenticated") {
          addLocalReply(
            "Your session ended. Please [log in](/auth) again to keep chatting.",
          );
          return;
        }
        if (res === "rate_limited") {
          addLocalReply(
            "You're sending messages a bit fast. Give me a minute and try again.",
          );
          return;
        }
        if (typeof res === "object" && res?.content) {
          const isPick = res.content.includes(PICK_MARKER) || isPickRequest;
          const content = res.content.replaceAll(PICK_MARKER, "").trim();
          setMessages((prev) => [...prev, { role: "assistant", content }]);
          const link = content.match(PICK_LINK)?.[0];
          if (isPick && link) onRecommend?.(link);
          return;
        }
        // Failed or empty answer: move on to the next model
        modelNumber.current = (modelNumber.current + 1) % CHAT_MODELS.length;
      }
      addLocalReply("Sorry, I couldn't get an answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function startNewChat() {
    setMessages([GREETING]);
    setInput("");
  }

  const hasConversation = messages.some((m) => m.role === "user");

  return {
    messages,
    input,
    setInput,
    handleSendMessage,
    startNewChat,
    messagesRef,
    isLoading,
    isSignedIn,
    hasConversation,
    starters: buildStarters(userGamesData),
  };
}

export default useChat;
