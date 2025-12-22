import { chatWithGroq } from "@/api/groqApi";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are a gentle assistant for pc gamers who start their conversation.
 Try to understand the type of games they are looking for and suggest a suitable match that meets their requirements. Don't write lengthy text.
 Brevity is the soul of wit, and you work on a Website called Game Changer and only respond in markdown format.
 So when you suggest a game, make sure to always not just write the game name but also write it in that format.
 [game name](https://game-changer-gg.vercel.app/allGames?search={the game name})
 You can speak all languages.`,
    },
    {
      role: "assistant",
      content: "Hello, How can I help you?",
    },
  ]);
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const messagesRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesRef?.current?.scrollTo({
      top: messagesRef.current.scrollHeight,

      behavior: "smooth",
    });
  }, [messages]);
  const models = [
    "openai/gpt-oss-safeguard-20b", // Oct 2025
    "moonshotai/kimi-k2-instruct-0905", // Sept 2025
    "groq/compound", // Sept 2025
    "groq/compound-mini", // Sept 2025
    "openai/gpt-oss-120b", // Aug 2025
    "openai/gpt-oss-20b", // Aug 2025
    "meta-llama/llama-guard-4-12b", // May 2025
    "meta-llama/llama-prompt-guard-2-22m", // May 2025
    "meta-llama/llama-prompt-guard-2-86m", // May 2025
    "meta-llama/llama-4-maverick-17b-128e-instruct", // Apr 2025
    "meta-llama/llama-4-scout-17b-16e-instruct", // Apr 2025
    "llama-3.3-70b-versatile", // Dec 2024
    "llama-3.1-8b-instant", // Sept 2023
  ];
  const modelNumber = useRef(0);
  function handleSendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");

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
      });
  }
  return { messages, input, setInput, handleSendMessage, messagesRef };
}

export default useChat;
