import { chatWithGroq } from "@/api/groqApi";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function useChat() {
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
      content: `You are a specialized AI assistant for a gaming website called Game Changer,
      your role is to help PC gamers discover games that match their preferences while being friendly,
      concise, and knowledgeable, you must ONLY talk about gaming topics such as PC games, genres, mechanics,
      performance, and recommendations, if the user asks about anything outside gaming you must politely refuse
      and redirect to gaming topics, keep responses very short and direct, ask 1–2 quick questions if needed to
      understand the user’s taste, prioritize matching based on genre, mood, difficulty, and similar games,
      ALWAYS format game suggestions exactly like this 
      [Game Name](https://game-changer-gg.vercel.app/allGames?search=Game%20Name),
      mention each game only once, never repeat games, never write game names outside this format,
      ALWAYS respond in markdown, use short bullet points for multiple games, avoid long paragraphs,
      automatically detect and reply in the user’s language and try to start the message with the same
      language of the user’s message before recommending the game and always answer in one paragraph without bullet points,
      keep tone friendly and gamer-like with no
      unnecessary explanations and no emojis unless the user uses them first,
      always suggest 1 game by default,
      if unclear ask a short clarifying question, example behavior:
      if user says "I like games like Hades" respond with bullet points of formatted links like
      [Dead Cells](https://game-changer-gg.vercel.app/allGames?search=Dead%20Cells) and 
      [Curse of the Dead Gods](https://game-changer-gg.vercel.app/allGames?search=Curse%20of%20the%20Dead%20Gods),
      if user says "Suggest a relaxing game" ask a short follow-up question like farming, exploration,or puzzle,
      After each suggested game link, add a very brief (10–20 words) description explaining
      why it matches the user’s request,
      never generate harmful or inappropriate content and never break formatting rules`,
    },
    {
      role: "assistant",
      content: "Hello, How can I help you?",
    },
  ]);
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
          console.log(modelNumber.current);
        } else {
          setMessages((prev) => [...prev, res]);
          const gamesLinks = res.content.match(/allGames\?search=([^)\s]*)/g);
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
