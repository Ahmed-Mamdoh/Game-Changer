import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import chatBotIcon from "@/assets/chatbot-icon.png";
import { FaPaperPlane } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { chatWithGroq } from "@/api/groqApi";
import { useNavigate, Link } from "react-router-dom";
import Markdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";

export default function ChatBot() {
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
  const modelNumber = 0;
  function handleSendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");

    chatWithGroq({
      model: models[modelNumber],
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
  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesRef?.current?.scrollTo({
      top: messagesRef.current.scrollHeight,

      behavior: "smooth",
    });
  }, [messages]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-neutral fixed right-10 bottom-10 z-10 cursor-pointer rounded-full">
          <img src={chatBotIcon} alt="" className="h-16 w-16" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-neutral max-h-[75vh] w-80 border-0">
        <div className="flex flex-col gap-2">
          <div
            ref={messagesRef}
            className="flex max-h-[60vh] flex-col gap-2 overflow-x-hidden overflow-y-auto"
          >
            {messages.map((item, index) => {
              if (item.role === "user")
                return (
                  <div key={index} className="chat chat-start">
                    <div className="chat-bubble">{item.content}</div>
                  </div>
                );
              if (item.role === "assistant") {
                return (
                  <div key={index} className="chat chat-end">
                    <div className="chat-bubble bg-primary/70 text-primary-content">
                      <Markdown
                        components={{
                          a: ({ href, children, ...props }) => {
                            const isInternal =
                              href?.startsWith("/") ||
                              href?.startsWith(
                                "https://game-changer-gg.vercel.app",
                              );
                            if (isInternal) {
                              const to = href.replace(
                                "https://game-changer-gg.vercel.app",
                                "",
                              );
                              return (
                                <Link
                                  to={to}
                                  {...props}
                                  className="hover:text-secondary/80 text-secondary transform underline transition-colors duration-200"
                                >
                                  {children}
                                </Link>
                              );
                            }
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline hover:text-blue-300"
                                {...props}
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {item.content}
                      </Markdown>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          <div className="flex h-full items-center gap-2">
            <Textarea
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="max-h-[10vh] min-h-6 w-full resize-none overflow-auto ring-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="bg-primary text-primary-content cursor-pointer rounded-full px-2 py-2"
            >
              <FaPaperPlane className="h-4 w-4" />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
