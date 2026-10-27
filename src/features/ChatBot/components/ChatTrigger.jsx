import chatBotIcon from "@/assets/chatbot-icon.webp";
import { PopoverTrigger } from "@radix-ui/react-popover";
function ChatTrigger() {
  return (
    <PopoverTrigger asChild>
      <button
        aria-label="Ask the game assistant"
        title="Ask the game assistant"
        className="bg-bg-raised border-stroke-medium hover:bg-bg-chip fixed right-5 bottom-5 z-20 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border shadow-[var(--shadow-float)] transition-colors duration-100 md:right-8 md:bottom-8"
      >
        <img
          src={chatBotIcon}
          alt=""
          className="h-11 w-11"
          width={44}
          height={44}
          loading="eager"
        />
      </button>
    </PopoverTrigger>
  );
}

export default ChatTrigger;
