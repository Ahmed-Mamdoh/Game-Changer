import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChevronDown } from "lucide-react";
import AssistantMark from "./AssistantMark";

function ChatTrigger({ open }) {
  const label = open ? "Close the game assistant" : "Ask the game assistant";
  return (
    <DialogTrigger asChild>
      <button
        aria-label={label}
        title={label}
        className="bg-bg-raised border-stroke-medium hover:bg-bg-chip fixed right-5 bottom-5 z-20 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border shadow-[var(--shadow-float)] transition-colors duration-100 md:right-8 md:bottom-8"
      >
        {open ? (
          <ChevronDown className="text-text-main h-6 w-6" aria-hidden />
        ) : (
          <AssistantMark />
        )}
      </button>
    </DialogTrigger>
  );
}

export default ChatTrigger;
