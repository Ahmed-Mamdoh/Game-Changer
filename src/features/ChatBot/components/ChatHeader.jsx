import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { SquarePen, X } from "lucide-react";

const iconButton =
  "text-text-dim hover:text-text-main hover:bg-bg-chip flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors duration-100 disabled:pointer-events-none disabled:opacity-40";

function ChatHeader({ onNewChat, canReset }) {
  return (
    <div className="border-stroke-subtle flex items-center gap-2 border-b py-2 ps-4 pe-2">
      <div className="min-w-0 flex-1">
        <DialogTitle className="font-heading text-text-main text-sm font-semibold">
          Game assistant
        </DialogTitle>
        <p className="text-text-muted text-xs">Picks shaped by your library</p>
      </div>
      <button
        type="button"
        onClick={onNewChat}
        disabled={!canReset}
        aria-label="New chat"
        title="New chat"
        className={iconButton}
      >
        <SquarePen className="h-4 w-4" aria-hidden />
      </button>
      <DialogClose aria-label="Close" title="Close" className={iconButton}>
        <X className="h-4 w-4" aria-hidden />
      </DialogClose>
    </div>
  );
}

export default ChatHeader;
