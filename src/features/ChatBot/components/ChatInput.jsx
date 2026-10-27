import { Textarea } from "@/components/ui/textarea";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({ handleSendMessage, input, setInput }) {
  return (
    <div className="flex h-full items-center gap-2">
      <Textarea
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about a game or what to play next"
        aria-label="Message the assistant"
        className="focus-visible:border-stroke-brand bg-bg-base border-stroke-subtle font-arabic
        max-h-[10dvh] min-h-10 w-full resize-none overflow-auto rounded-md border px-3
        py-2 text-sm ring-transparent focus-visible:ring-0"
        autoFocus
      />
      <button
        onClick={handleSendMessage}
        aria-label="Send"
        disabled={!input.trim()}
        className="bg-action text-on-action flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FaPaperPlane className="h-4 w-4" />
      </button>
    </div>
  );
}

export default ChatInput;
