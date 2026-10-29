import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DISMISS_REASONS,
  addDismissed,
  clearDismissed,
  removeDismissed,
  setReason,
} from "@/features/games/dismissedGames";
import { useDismissedGames } from "@/features/games/hooks/useDismissedGames";
import { forgetPicks } from "@/features/games/hooks/useGetRecommendations";
import { UserToken } from "@/hooks/useUserToken";
import { coverUrlOf } from "@/utils/igdbImage";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, EyeOff, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

const yearOf = (game) =>
  game.first_release_date
    ? new Date(game.first_release_date * 1000).getUTCFullYear()
    : null;

// One hidden game: what it is, why it's hidden, and the way back
function HiddenRow({ game, onReason, onShow }) {
  const cover = coverUrlOf(game, "t_cover_small");
  const year = yearOf(game);
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:flex-nowrap">
      <Link
        to={`/game/${game.id}`}
        className="flex min-w-0 flex-1 items-center gap-4 rounded-sm"
      >
        <span className="bg-bg-raised aspect-[3/4] w-12 shrink-0 overflow-hidden rounded-sm">
          {cover && (
            <img
              src={cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </span>
        <span className="min-w-0">
          <span className="text-text-main block truncate font-semibold hover:underline hover:underline-offset-4">
            {game.name || "Unknown game"}
          </span>
          {year && (
            <span className="text-text-dim tabular block text-sm">{year}</span>
          )}
        </span>
      </Link>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Select value={game.reason} onValueChange={onReason}>
          <SelectTrigger
            aria-label={`Why ${game.name || "this game"} is hidden`}
            className="border-stroke-medium text-text-main h-9 w-40 cursor-pointer rounded-md bg-transparent text-sm font-semibold hover:bg-white/[0.06] max-sm:flex-1"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-bg-raised border-stroke-medium text-text-main rounded-lg shadow-[var(--shadow-float)]">
            {DISMISS_REASONS.map(({ reason, label }) => (
              <SelectItem
                key={reason}
                value={reason}
                className="focus:bg-bg-chip min-h-9 cursor-pointer"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={onShow}
          className="btn-quiet h-9 px-4 max-sm:flex-1"
        >
          Show again
        </button>
      </div>
    </li>
  );
}

function RowsSkeleton() {
  return (
    <ul
      aria-hidden="true"
      className="panel divide-stroke-subtle divide-y overflow-hidden"
    >
      {[0, 1, 2].map((key) => (
        <li key={key} className="flex items-center gap-4 px-4 py-3">
          <span className="bg-bg-raised aspect-[3/4] w-12 animate-pulse rounded-sm motion-reduce:animate-none" />
          <span className="bg-bg-raised h-4 w-40 animate-pulse rounded-sm motion-reduce:animate-none" />
        </li>
      ))}
    </ul>
  );
}

function HiddenGamesPage() {
  const user_id = UserToken()?.user?.id;
  const queryClient = useQueryClient();
  const { games, count, isLoading, error } = useDismissedGames(user_id, {
    withDetails: true,
  });
  const [isResetOpen, setIsResetOpen] = useState(false);

  if (!user_id) return <Navigate to="/auth" replace />;

  const listKey = ["dismissed_games", user_id];
  // Changes show at once; For You rebuilds on the next visit
  function updateList(change) {
    queryClient.setQueryData(listKey, (current) =>
      current ? change(current) : current,
    );
    forgetPicks(queryClient, user_id);
  }

  function onReason(game, reason) {
    setReason(user_id, game.id, reason);
    updateList((current) => ({
      ...current,
      reasons: new Map(current.reasons).set(game.id, reason),
    }));
  }

  function onShow(game) {
    const index = games.findIndex((g) => g.id === game.id);
    removeDismissed(user_id, game.id);
    updateList((current) => ({
      ...current,
      ids: current.ids.filter((id) => id !== game.id),
    }));
    toast(
      (t) => (
        <span className="flex items-center gap-3">
          <span>{game.name} can come up in your picks again.</span>
          <button
            type="button"
            className="text-text-brand cursor-pointer font-semibold hover:underline hover:underline-offset-4"
            onClick={() => {
              addDismissed(user_id, game.id, game.reason);
              updateList((current) => {
                const ids = current.ids.filter((id) => id !== game.id);
                ids.splice(index, 0, game.id);
                return { ...current, ids };
              });
              toast.dismiss(t.id);
            }}
          >
            Undo
          </button>
        </span>
      ),
      { duration: 6000 },
    );
  }

  async function onReset() {
    const { error: resetError } = await clearDismissed(user_id);
    if (resetError) {
      toast.error("Reset didn't go through. Try again in a moment.");
      return;
    }
    updateList(() => ({ ids: [], hiddenIds: new Set(), reasons: new Map() }));
    toast.success("For You is reset. Your next picks start from your library.");
  }

  return (
    <>
      <Helmet>
        <title>Hidden games | Game-Changer</title>
      </Helmet>
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col gap-8 px-4 pt-24 pb-16 md:px-8">
        <div className="flex flex-col gap-3">
          <Link to="/games/forYou" className="link-quiet w-fit">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            For you
          </Link>
          <div className="flex items-baseline gap-3">
            <h1 className="text-[length:var(--font-size-title)] leading-tight font-semibold tracking-tight">
              Hidden games
            </h1>
            {count > 0 && (
              <span className="text-text-dim tabular text-sm font-semibold">
                {count}
              </span>
            )}
          </div>
          <p className="text-text-dim max-w-[60ch]">
            Games you marked Not for me. They never come up in For You, and the
            ones marked Too old or Not my style also shape what does.
          </p>
        </div>

        {isLoading ? (
          <RowsSkeleton />
        ) : error && !count ? (
          <p className="text-text-dim">
            Your hidden games didn't load. Try again in a moment.
          </p>
        ) : count === 0 ? (
          <div className="panel flex flex-col items-start gap-4 px-6 py-10">
            <span className="text-text-dim flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06]">
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-text-main text-base font-semibold">
                Nothing hidden
              </h2>
              <p className="text-text-dim mt-1 text-sm">
                Games you mark Not for me on For You show up here.
              </p>
            </div>
            <Link to="/games/forYou" className="btn-quiet h-9 px-4">
              Back to For you
            </Link>
          </div>
        ) : (
          <ul className="panel divide-stroke-subtle divide-y overflow-hidden">
            {games.map((game) => (
              <HiddenRow
                key={game.id}
                game={game}
                onReason={(reason) => onReason(game, reason)}
                onShow={() => onShow(game)}
              />
            ))}
          </ul>
        )}

        {count > 0 && (
          <section className="border-stroke-subtle flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-text-main text-base font-semibold">
                Reset For You
              </h2>
              <p className="text-text-dim mt-1 max-w-[50ch] text-sm">
                Brings back every hidden game and forgets what they taught. Your
                library and ratings stay.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsResetOpen(true)}
              className="btn-quiet text-pulse-error shrink-0"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset For You
            </button>
          </section>
        )}
      </div>

      <ConfirmDialog
        open={isResetOpen}
        onOpenChange={setIsResetOpen}
        title="Reset For You?"
        description={`${count === 1 ? "Your hidden game" : `All ${count} hidden games`} can come up again, and the cutoff year and style dislikes they taught are gone. Your library and ratings stay. This can't be undone.`}
        confirmLabel="Reset"
        pendingLabel="Resetting…"
        onConfirm={onReset}
        icon={RotateCcw}
      />
    </>
  );
}

export default HiddenGamesPage;
