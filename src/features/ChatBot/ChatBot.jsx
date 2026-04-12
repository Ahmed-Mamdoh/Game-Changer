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
      <PopoverContent className="bg-obsidian-deep mr-6 max-h-[75dvh] w-80 rounded-2xl border-0">
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
