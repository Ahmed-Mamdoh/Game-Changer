import chatBotIcon from "@/assets/chatbot-icon.webp";
import { PopoverTrigger } from "@radix-ui/react-popover";
function ChatTrigger() {
  return (
    <PopoverTrigger asChild>
      <button className="bg-myGray fixed right-10 bottom-10 z-20 cursor-pointer rounded-full transition-transform hover:scale-110">
        <img src={chatBotIcon} alt="" className="h-16 w-16" />
      </button>
    </PopoverTrigger>
  );
}

export default ChatTrigger;
