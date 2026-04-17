import { Textarea } from "@/components/ui/textarea";
import { FaPaperPlane } from "react-icons/fa";

function ChatInput({ handleSendMessage, input, setInput }) {
  return (
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
        className="focus-within:border-pulse-primary bg-bg-card border-stroke-subtle font-arabic
        max-h-[10dvh] min-h-6 w-full resize-none overflow-auto rounded-full border px-4
        py-2 ring-transparent"
        autoFocus
      />
      <button
        onClick={handleSendMessage}
        className="bg-pulse-primary text-text-main  cursor-pointer rounded-full px-2 py-2"
      >
        <FaPaperPlane className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ChatInput;
