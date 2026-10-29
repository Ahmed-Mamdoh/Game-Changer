import { addUserGame, updateUserGame } from "@/api/supabase";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserToken } from "@/hooks/useUserToken";
import { coverUrlOf } from "@/utils/igdbImage";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, PenLine, Star, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useGetTimeToBeat } from "../hooks/useGetTimeToBeat";
import { STATUS_ICONS, STATUS_LABELS } from "../hooks/useQuickStatus";

const LOG_STATUSES = ["playing", "finished", "dropped"];
const REVIEW_MAX = 2000;

const fieldClass =
  "bg-bg-base border-stroke-subtle text-text-main placeholder:text-text-muted focus-visible:border-stroke-brand w-full rounded-md border text-sm outline-none transition-colors duration-100";

const hoursOf = (seconds) => (seconds ? Math.round(seconds / 3600) : null);

// size "sm" drops the readout, for rows that rate many games at once
export function StarRating({ value, onChange, size = "md", label = "Rating" }) {
  const [hover, setHover] = useState(0);
  const refs = useRef([]);
  const shown = hover || value;

  function select(next) {
    onChange(next);
    refs.current[Math.max(next, 1) - 1]?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      select(Math.min(5, value + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      select(Math.max(0, value - 1));
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div
        role="radiogroup"
        aria-label={label}
        className="-ml-1 flex"
        onMouseLeave={() => setHover(0)}
        onKeyDown={handleKeyDown}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            ref={(el) => (refs.current[n - 1] = el)}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            tabIndex={(value || 1) === n ? 0 : -1}
            onMouseEnter={() => setHover(n)}
            // Pressing the current rating again clears it
            onClick={() => onChange(value === n ? 0 : n)}
            className={`cursor-pointer rounded-sm ${size === "sm" ? "p-0.5" : "p-1"}`}
          >
            <Star
              strokeWidth={1.5}
              className={`${size === "sm" ? "h-5 w-5" : "h-7 w-7"} transition-colors duration-100 ${
                n <= shown
                  ? "fill-pulse-primary text-pulse-primary"
                  : "text-text-muted"
              }`}
            />
          </button>
        ))}
      </div>
      {size !== "sm" && (
        <span className="text-text-dim tabular text-sm">
          {value ? `${value} / 5` : "Not rated"}
        </span>
      )}
    </div>
  );
}

// Logs a game: status, rating, hours and review. Works for games already in
// the library (edit) and for games not in it yet (the log adds them).
// trigger: the button that opens it; defaultStatus: preselected for a new log;
// requireRating: a rating is needed to save; onSaved: called after a save.
// defaultOpen + onClose: opened from code instead of a trigger, e.g. to ask
// for a rating right after a status change, with the stars focused first.
function LogGameDialog({
  game,
  userGame,
  userGameReview,
  onRemove,
  trigger,
  defaultStatus = "",
  requireRating = false,
  onSaved,
  defaultOpen = false,
  onClose,
}) {
  const { id, name, first_release_date: releaseDate } = game;
  const user_id = UserToken()?.user?.id;
  const queryClient = useQueryClient();
  const { data: timeToBeat } = useGetTimeToBeat(id);
  const [open, setOpen] = useState(defaultOpen);
  const [isFavorite, setIsFavorite] = useState(Boolean(userGame?.is_favorite));

  const savedValues = () => ({
    status: LOG_STATUSES.includes(userGame?.status)
      ? userGame.status
      : defaultStatus,
    rating: userGameReview?.rating || 0,
    hours_played: userGame?.hours_played ?? "",
    review: userGameReview?.review || "",
  });

  const { register, handleSubmit, control, watch, reset, formState } = useForm({
    defaultValues: savedValues(),
  });
  const { errors, isSubmitting, isDirty } = formState;
  const reviewLength = watch("review")?.length || 0;

  const hasLog = Boolean(userGameReview?.rating || userGame?.hours_played);
  const year = releaseDate ? new Date(releaseDate * 1000).getFullYear() : null;
  const ttb = timeToBeat?.[0];
  const ttbHint = [
    hoursOf(ttb?.hastily) && `main story about ${hoursOf(ttb.hastily)} h`,
    hoursOf(ttb?.completely) &&
      `completionist about ${hoursOf(ttb.completely)} h`,
  ]
    .filter(Boolean)
    .join(", ");

  function handleOpenChange(next) {
    if (next) reset(savedValues());
    setOpen(next);
    if (!next) onClose?.();
  }

  function focusRating(e) {
    if (!defaultOpen) return;
    e.preventDefault();
    e.target.querySelector('[aria-label="Rating"] [tabindex="0"]')?.focus();
  }

  async function onSubmit(values) {
    const log = {
      game_id: id,
      user_id,
      status: values.status,
      hours_played:
        values.hours_played === "" ? null : Number(values.hours_played),
      rating: values.rating || null,
      review: values.review.trim(),
    };
    const { error } = userGame
      ? await updateUserGame(log)
      : await addUserGame({ ...log, rating: log.rating || 0 });
    if (error) {
      toast.error(`Couldn't save your log. ${error.message}`);
      return;
    }

    toast.success(`Saved your log for ${name}`);
    const gameId = String(id);
    queryClient.invalidateQueries({ queryKey: ["user_games", user_id] });
    queryClient.invalidateQueries({
      queryKey: ["user_game", user_id, gameId],
    });
    queryClient.invalidateQueries({
      queryKey: ["user_game_review", user_id, gameId],
    });
    queryClient.invalidateQueries({ queryKey: ["game_reviews", gameId] });
    setOpen(false);
    onSaved?.(values);
    onClose?.();
  }

  function toggleFavorite() {
    const next = !isFavorite;
    setIsFavorite(next);
    // Works off the game page too, so it needs no route data
    updateUserGame({ game_id: id, user_id, is_favorite: next }).then(
      ({ error }) => {
        if (error) {
          setIsFavorite(!next);
          toast.error("Couldn't update favorites. Try again.");
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["user_games", user_id] });
        queryClient.invalidateQueries({
          queryKey: ["user_game", user_id, String(id)],
        });
      },
    );
  }

  function removeFromLibrary() {
    // Close first so the confirm prompt doesn't stack on top of this dialog
    setOpen(false);
    onRemove();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!defaultOpen && (
        <DialogTrigger asChild>
          {trigger || (
            <button type="button" className="btn-on-art">
              {hasLog ? (
                <PenLine className="h-4 w-4" />
              ) : (
                <Star className="h-4 w-4" />
              )}
              {hasLog ? "Edit log" : "Rate & review"}
            </button>
          )}
        </DialogTrigger>
      )}

      <DialogContent
        onOpenAutoFocus={focusRating}
        overlayClassName="confirm-overlay"
        className="log-panel bg-bg-surface border-stroke-medium gap-0 overflow-hidden rounded-2xl border p-0 shadow-[var(--shadow-float)] max-sm:top-auto max-sm:bottom-0 max-sm:max-h-[92dvh] max-sm:max-w-full max-sm:translate-y-0 max-sm:overflow-y-auto max-sm:rounded-b-none sm:max-w-[34rem]"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Header: the game itself, its art bleeding in behind */}
          <div className="relative isolate flex items-center gap-4 px-6 pt-6 pb-5">
            <img
              src={coverUrlOf(game, "t_cover_small")}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 -z-10 h-full w-full scale-125 object-cover opacity-30 blur-2xl"
            />
            <div className="from-bg-surface/40 to-bg-surface absolute inset-0 -z-10 bg-gradient-to-b" />
            <img
              src={coverUrlOf(game, "t_cover_big")}
              alt={`${name} cover`}
              className="aspect-[3/4] w-16 shrink-0 rounded-md object-cover outline-1 -outline-offset-1 outline-white/15"
            />
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-text-main text-xl leading-tight font-semibold text-balance">
                {name}
              </DialogTitle>
              <DialogDescription className="text-text-dim tabular mt-1 text-sm">
                {year ? `${year} · ` : ""}Your log
              </DialogDescription>
            </div>
            {/* Favorites live on the library row, so only once it exists */}
            {userGame && (
              <button
                type="button"
                onClick={toggleFavorite}
                aria-pressed={isFavorite}
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                className="hover:bg-bg-raised mt-6 -mr-2 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-100"
              >
                <Heart
                  className={`h-[18px] w-[18px] ${isFavorite ? "fill-pulse-error text-pulse-error" : "text-text-dim"}`}
                />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-6 px-6 pt-1 pb-6">
            {/* Status */}
            <fieldset className="flex flex-col gap-2">
              <legend className="text-text-main mb-2 text-sm font-semibold">
                Status
              </legend>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Pick a status to save your log." }}
                render={({ field }) => (
                  <div
                    role="radiogroup"
                    aria-label="Status"
                    className="segmented bg-bg-base w-full backdrop-blur-none sm:w-fit"
                  >
                    {LOG_STATUSES.map((status) => {
                      const { icon: Icon, color } = STATUS_ICONS[status];
                      return (
                        <button
                          key={status}
                          type="button"
                          role="radio"
                          aria-checked={field.value === status}
                          onClick={() => field.onChange(status)}
                          className="flex-1 justify-center sm:flex-none"
                        >
                          <Icon className={`h-3.5 w-3.5 ${color}`} />
                          {STATUS_LABELS[status]}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              {errors.status && (
                <p className="text-text-error text-sm">
                  {errors.status.message}
                </p>
              )}
            </fieldset>

            {/* Rating */}
            <div className="flex flex-col gap-2">
              <span className="text-text-main text-sm font-semibold">
                Rating
                {(requireRating || defaultOpen) && (
                  <span className="text-text-muted font-normal">
                    {" "}
                    · tells your picks what you liked
                  </span>
                )}
              </span>
              <Controller
                name="rating"
                control={control}
                rules={
                  requireRating
                    ? { validate: (v) => v > 0 || "Rate it to save your log." }
                    : undefined
                }
                render={({ field }) => (
                  <StarRating value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.rating && (
                <p className="text-text-error text-sm">
                  {errors.rating.message}
                </p>
              )}
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="hours_played"
                className="text-text-main text-sm font-semibold"
              >
                Hours played
              </label>
              <div className="relative w-36">
                <input
                  id="hours_played"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  placeholder="0"
                  aria-invalid={Boolean(errors.hours_played)}
                  aria-describedby={ttbHint ? "hours_hint" : undefined}
                  className={`${fieldClass} tabular h-10 [appearance:textfield] pr-8 pl-3 [&::-webkit-inner-spin-button]:appearance-none`}
                  {...register("hours_played", {
                    validate: (v) =>
                      v === "" ||
                      (Number.isInteger(Number(v)) && Number(v) >= 0) ||
                      "Use whole hours, 0 or more.",
                  })}
                />
                <span className="text-text-muted pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm">
                  h
                </span>
              </div>
              {errors.hours_played ? (
                <p className="text-text-error text-sm">
                  {errors.hours_played.message}
                </p>
              ) : (
                ttbHint && (
                  <p id="hours_hint" className="text-text-muted text-xs">
                    Most players: {ttbHint}
                  </p>
                )
              )}
            </div>

            {/* Review */}
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor="review"
                  className="text-text-main text-sm font-semibold"
                >
                  Review
                </label>
                <span
                  className={`tabular text-xs ${reviewLength > REVIEW_MAX ? "text-text-error" : "text-text-muted"}`}
                >
                  {reviewLength.toLocaleString()} /{" "}
                  {REVIEW_MAX.toLocaleString()}
                </span>
              </div>
              <textarea
                id="review"
                rows={5}
                placeholder="What did you think?"
                aria-invalid={Boolean(errors.review)}
                className={`${fieldClass} min-h-28 resize-y p-3 leading-relaxed`}
                {...register("review", {
                  maxLength: {
                    value: REVIEW_MAX,
                    message: `Keep it under ${REVIEW_MAX.toLocaleString()} characters.`,
                  },
                  validate: (v, values) =>
                    !v.trim() ||
                    values.rating > 0 ||
                    "Add a rating to post your review.",
                })}
              />
              {errors.review && (
                <p className="text-text-error text-sm">
                  {errors.review.message}
                </p>
              )}
            </div>
          </div>

          <div className="border-stroke-subtle flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4">
            {onRemove && (
              <button
                type="button"
                onClick={removeFromLibrary}
                className="text-text-dim hover:text-text-error -ml-2 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md px-2 text-sm font-semibold transition-colors duration-100"
              >
                <Trash2 className="h-4 w-4" />
                Remove from library
              </button>
            )}
            <div className="ml-auto flex items-center gap-2">
              <DialogClose asChild>
                <button type="button" className="btn-quiet">
                  {defaultOpen ? "Skip" : "Cancel"}
                </button>
              </DialogClose>
              <button
                type="submit"
                disabled={isSubmitting || (Boolean(userGame) && !isDirty)}
                className="btn-primary"
              >
                {isSubmitting ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LogGameDialog;
