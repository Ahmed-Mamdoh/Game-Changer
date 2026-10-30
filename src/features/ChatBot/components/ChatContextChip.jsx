import { X } from "lucide-react";

// The game the chat is about, shown in the composer like an attachment
function ChatContextChip({ game, onRemove }) {
  return (
    <div className="bg-bg-raised border-stroke-subtle flex items-center gap-2.5 rounded-lg border py-1.5 ps-1.5 pe-1">
      {game.cover ? (
        <img
          src={game.cover}
          alt=""
          width={24}
          height={32}
          className="h-8 w-6 shrink-0 rounded-[3px] object-cover"
        />
      ) : null}
      <div className="min-w-0 flex-1 leading-tight">
        <p className="text-text-muted text-[11px]">Asking about</p>
        <p className="text-text-main truncate text-xs font-medium">
          {game.name}
          {game.year ? (
            <span className="text-text-muted font-normal"> · {game.year}</span>
          ) : null}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Stop asking about ${game.name}`}
        title="Remove"
        className="text-text-muted hover:text-text-main hover:bg-bg-chip flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-100"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}

export default ChatContextChip;
