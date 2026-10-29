import { coverUrlOf } from "@/utils/igdbImage";
import toast from "react-hot-toast";

// A toast about one game: its cover, its name, what happened, and an
// optional action such as Undo. Styling comes from the Toaster in AppLayout.
export function gameToast({ game, message, icon: Icon, iconClass, action }) {
  const cover = coverUrlOf(game, "t_cover_small");

  return toast(
    (t) => (
      <div className="flex w-[22rem] max-w-[calc(100vw-4.5rem)] min-w-0 items-center gap-3">
        {cover && (
          <img
            src={cover}
            alt=""
            className="aspect-[3/4] w-8 shrink-0 rounded-sm object-cover outline-1 -outline-offset-1 outline-white/15"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-text-main truncate font-semibold">{game.name}</p>
          <p className="text-text-dim flex items-center gap-1.5 text-xs">
            {Icon && <Icon className={`h-3.5 w-3.5 shrink-0 ${iconClass}`} />}
            {message}
          </p>
        </div>
        {action && (
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              action.onClick();
            }}
            className="text-text-brand hover:bg-bg-chip -mr-1 h-8 shrink-0 cursor-pointer rounded-md px-2.5 text-sm font-semibold transition-colors duration-100"
          >
            {action.label}
          </button>
        )}
      </div>
    ),
    { duration: action ? 6000 : 4000 },
  );
}
