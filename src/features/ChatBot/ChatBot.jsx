import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import Markdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import useChat from "./hooks/useChat";
import ChatTrigger from "./components/ChatTrigger";
import MessageList from "./components/MessageList";

export default function ChatBot() {
  const { messages, input, setInput, handleSendMessage, messagesRef } =
    useChat();
  return (
    <Popover>
      <ChatTrigger />
      <PopoverContent className="bg-neutral max-h-[75vh] w-80 border-0">
        <div className="flex flex-col gap-2">
          <MessageList messages={messages} messagesRef={messagesRef} />
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
