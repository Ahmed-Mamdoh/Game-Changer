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
        className="max-h-[10vh] min-h-6 w-full resize-none overflow-auto ring-transparent"
      />
      <button
        onClick={handleSendMessage}
        className="bg-primary text-primary-content cursor-pointer rounded-full px-2 py-2"
      >
        <FaPaperPlane className="h-4 w-4" />
      </button>
    </div>
  );
}

export default ChatInput;
