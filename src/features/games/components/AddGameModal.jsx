import { addUserGame, updateUserGame } from "@/api/supabase";
import Rating from "@/components/Rating";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserToken } from "@/hooks/useUserToken";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPen, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ModalDate from "../ui/ModalDate";
import ModalSelect from "../ui/ModalSelect";
import { formatIGDBImage } from "@/utils/igdbImage";

function AddGameModal({ game, isUpdate = false, userGame, userGameReview }) {
  const { id, name, cover, first_release_date } = game;

  const game_cover = formatIGDBImage(cover?.url, "t_720p_2x");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState, control, watch } = useForm({
    defaultValues: {
      review: userGameReview?.review || "",
    },
  });
  const { errors } = formState;
  const user_id = UserToken()?.user?.id;

  const status = watch("status") || userGame?.status;
  const isLoadingRef = useRef(false);
  const [open, setOpen] = useState(false);

  function handleAddGame(data) {
    if (isLoadingRef.current === true) return;

    isLoadingRef.current = true;
    data.date_finished =
      data.status === "playing"
        ? null
        : data.date_finished
          ? new Date(data.date_finished).toISOString().split("T")[0]
          : null;
    toast
      .promise(
        async () => {
          const { error } = await addUserGame({
            game_id: id,
            user_id,
            ...data,
          });
          if (error) {
            throw error;
          }
          return "Game added successfully";
        },
        {
          loading: "Adding game...",
          success: "Game added successfully",
          error: (error) => error.message,
        },
      )
      .finally(() => {
        const gameId = String(id);
        queryClient.refetchQueries({
          queryKey: ["user_game", user_id, gameId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user_games", user_id],
        });
        queryClient.refetchQueries({
          queryKey: ["game_reviews", gameId],
        });
        queryClient.refetchQueries({
          queryKey: ["user_game_review", user_id, gameId],
        });
        isLoadingRef.current = false;
        setOpen(false);
      });
  }

  function handleUpdateGame(data) {
    if (isLoadingRef.current === true) return;
    isLoadingRef.current = true;
    data.date_finished =
      data.status === "playing"
        ? null
        : data.date_finished
          ? new Date(data.date_finished).toISOString().split("T")[0]
          : null;
    toast
      .promise(
        async () => {
          const { error } = await updateUserGame({
            game_id: id,
            user_id,
            ...data,
            date_finished: status === "playing" ? null : data.date_finished,
          });
          if (error) {
            throw error;
          }
          return "Game updated successfully";
        },
        {
          loading: "Updating game...",
          success: "Game updated successfully",
          error: (error) => error.message,
        },
      )
      .finally(() => {
        const gameId = String(id);
        queryClient.refetchQueries({
          queryKey: ["user_game", user_id, gameId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user_games", user_id],
        });
        queryClient.refetchQueries({
          queryKey: ["game_reviews", gameId],
        });
        queryClient.refetchQueries({
          queryKey: ["user_game_review", user_id, gameId],
        });
        isLoadingRef.current = false;
        setOpen(false);
      });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (user_id) setOpen(!open);
        else navigate("/auth");
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className={isUpdate ? "btn-on-art" : "btn-primary"}
        >
          {isUpdate ? (
            <FaPen className="h-3.5 w-3.5" />
          ) : (
            <FaPlus className="h-3.5 w-3.5" />
          )}
          {isUpdate ? "Edit log" : "Log game"}
        </button>
      </DialogTrigger>

      <DialogContent className="bg-bg-surface border-stroke-medium rounded-xl border shadow-[var(--shadow-float)] sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
        <div className="flex w-full items-start gap-x-10">
          {/* Game Data */}
          <div className="hidden h-full flex-col items-start justify-between sm:flex">
            <img
              src={game_cover}
              className="w-56 rounded-lg object-contain"
              alt={name}
              title={name}
              fetchPriority="high"
              loading="lazy"
            />

            <div className="flex flex-col gap-1">
              <h3>{name}</h3>
              <p>
                Release Date:{" "}
                {new Date(first_release_date * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          {/* Game Form */}
          <form
            onSubmit={handleSubmit(
              isUpdate || userGame?.status === "to play" // If the game is in the wishlist, update instead
                ? handleUpdateGame
                : handleAddGame,
            )}
            className="h-full w-full"
          >
            <div className="flex w-full flex-col gap-4 ">
              {/* Form header */}
              <div className="flex w-full flex-col items-center justify-center gap-1">
                {/* Unstyled Radix parts so the heading keeps its look */}
                <DialogPrimitive.Title asChild>
                  <h2>{isUpdate ? "Update Game" : "Add Game"}</h2>
                </DialogPrimitive.Title>
                <DialogPrimitive.Description asChild>
                  <p>
                    {isUpdate
                      ? "Update game details"
                      : "Add a new game to your list."}
                  </p>
                </DialogPrimitive.Description>
              </div>

              {/* Status and Rating fields */}
              <div className="justify flex flex-col items-start gap-3 md:flex-row md:items-center">
                {/* Status field */}
                <div className="flex w-full flex-col gap-3 ">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status *</Label>
                    {errors["status"] && (
                      <p className="text-error text-sm leading-0">
                        {errors["status"].message}
                      </p>
                    )}
                  </div>
                  <ModalSelect
                    control={control}
                    name="status"
                    defaultValue={userGame?.status || ""}
                  />
                </div>
                {/* Rating field */}
                <div className="flex w-full flex-col gap-3">
                  <div className="flex w-full items-center justify-between">
                    <Label htmlFor="rating" className="text-sm">
                      Rating *
                    </Label>
                    {errors["rating"] && (
                      <p className="text-error text-sm leading-0">
                        {errors["rating"].message}
                      </p>
                    )}
                  </div>
                  <Rating
                    defaultValue={userGameReview?.rating}
                    control={control}
                    name="rating"
                  />
                </div>
              </div>

              {/* Hours Played and Date Finished fields */}
              <div className="flex items-center gap-3">
                {/* Hours Played field */}
                <div className="flex w-full flex-col gap-3">
                  <Label htmlFor="hours_played">Hours Played *</Label>
                  <Input
                    id="hours_played"
                    name="hours_played"
                    type="number"
                    className="border-stroke-subtle bg-bg-card rounded-full border focus-visible:ring-0"
                    min={1}
                    defaultValue={userGame?.hours_played || ""}
                    {...register("hours_played", {
                      required: "Hours played is required",
                    })}
                  />

                  <p className="text-error text-sm leading-0">
                    {errors["hours_played"] && errors["hours_played"].message}
                  </p>
                </div>
              </div>

              {/* Review field */}
              <div className="flex w-full flex-col gap-3 pt-3">
                <div className="flex w-full items-center justify-between">
                  <Label htmlFor="review">Review</Label>
                  <p className="text-error text-sm leading-0">
                    {errors["review"] && errors["review"].message}
                  </p>
                </div>
                <textarea
                  name="review"
                  id="review"
                  {...register("review", {
                    maxLength: {
                      value: 2000,
                      message: "Review must be less than 2000 characters",
                    },
                  })}
                  className="bg-bg-base border-stroke-subtle focus:border-stroke-brand min-h-24 w-full rounded-md border p-3 outline-none"
                ></textarea>
              </div>
            </div>
            {/* Form footer */}
            <DialogFooter className=" pt-4">
              <DialogClose asChild>
                <button type="button" className="btn-quiet">
                  Cancel
                </button>
              </DialogClose>
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoadingRef.current}
                className="btn-primary"
              >
                {isUpdate ? "Save changes" : "Add to library"}
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddGameModal;
