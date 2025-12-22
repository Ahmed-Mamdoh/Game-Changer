import chatBotIcon from "@/assets/chatbot-icon.png";
import { PopoverTrigger } from "@radix-ui/react-popover";
function ChatTrigger() {
  return (
    <PopoverTrigger asChild>
      <button className="bg-neutral fixed right-10 bottom-10 z-10 cursor-pointer rounded-full">
        <img src={chatBotIcon} alt="" className="h-16 w-16" />
      </button>
    </PopoverTrigger>
  );
}

export default ChatTrigger;
