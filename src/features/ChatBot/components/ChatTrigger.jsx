import chatBotIcon from "@/assets/chatbot-icon.webp";
import { PopoverTrigger } from "@radix-ui/react-popover";
function ChatTrigger() {
  return (
    <PopoverTrigger asChild>
      <button className="bg-bg-surface border-stroke-subtle fixed right-7 bottom-7 z-20 cursor-pointer rounded-full border transition-transform hover:scale-110 md:right-10 md:bottom-10">
        <img src={chatBotIcon} alt="" className="h-16 w-16" />
      </button>
    </PopoverTrigger>
  );
}

export default ChatTrigger;
