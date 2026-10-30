import { Textarea } from "@/components/ui/textarea";
import { Square } from "lucide-react";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({
  handleSendMessage,
  input,
  setInput,
  inputRef,
  isLoading,
  onStop,
}) {
  return (
    <div className="flex items-end gap-2">
      <Textarea
        ref={inputRef}
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
        rows={1}
        className="focus-visible:border-stroke-brand bg-bg-base border-stroke-subtle font-arabic
        max-h-32 min-h-10 w-full resize-none overflow-auto rounded-md border px-3
        py-2 text-sm ring-transparent focus-visible:ring-0"
      />
      {/* While a reply is coming in, the send button stops it instead */}
      {isLoading ? (
        <button
          onClick={onStop}
          aria-label="Stop the reply"
          title="Stop the reply"
          className="bg-action text-on-action hover:bg-action-hover flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-100"
        >
          <Square className="h-3.5 w-3.5 fill-current" />
        </button>
      ) : (
        <button
          onClick={handleSendMessage}
          aria-label="Send"
          disabled={!input.trim()}
          className="bg-action text-on-action flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaPaperPlane className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default ChatInput;
