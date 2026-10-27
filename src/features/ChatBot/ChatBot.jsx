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
      <PopoverContent className="bg-bg-surface border-stroke-medium text-text-main mr-4 max-h-[75dvh] w-[min(22rem,calc(100vw-2rem))] rounded-xl border p-3 shadow-[var(--shadow-float)]">
        <div className="flex flex-col gap-2">
          <MessageList
            messages={messages}
            messagesRef={messagesRef}
            isLoading={isLoading}
          />
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
