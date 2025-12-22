import { Popover, PopoverContent } from "@/components/ui/popover";
import useChat from "./hooks/useChat";
import ChatTrigger from "./components/ChatTrigger";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

export default function ChatBot() {
  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    messagesRef,
    isLoading,
  } = useChat();
  return (
    <Popover>
      <ChatTrigger />
      <PopoverContent className="bg-neutral max-h-[75vh] w-80 border-0">
        <div className="flex flex-col gap-2">
          <MessageList
            messages={messages}
            messagesRef={messagesRef}
            isLoading={isLoading}
          />
          {messages.length <= 2 && (
            <div className="mb-2 flex flex-wrap gap-2 px-2">
              {["horror game", "Best RPGs right now?", "Cozy indie game?"].map(
                (text) => (
                  <button
                    key={text}
                    onClick={() => {
                      handleSendMessage(text);
                      // Optionally trigger send immediately
                    }}
                    className="bg-secondary/50 hover:bg-secondary/70 border-secondary/30 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    {text}
                  </button>
                ),
              )}
            </div>
          )}
          <ChatInput
            handleSendMessage={handleSendMessage}
            input={input}
            setInput={setInput}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
