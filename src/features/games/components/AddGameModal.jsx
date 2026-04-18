import { addGame, updateUserGame } from "@/api/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPen, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ModalDate from "../ui/ModalDate";
import ModalSelect from "../ui/ModalSelect";
import Rating from "@/components/Rating";

function AddGameModal({
  game_id,
  releaseDate,
  genresData,
  themesData,
  game_name,
  game_cover,
  isUpdate = false,
  userGame,
  userGameReview,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState, control, watch } = useForm();
  const { errors } = formState;
  const userToken = localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token");
  const user_id = JSON.parse(userToken || "{}")?.user?.id;

  const genres = genresData?.map((genre) => genre.name) || [];
  const themes = themesData?.map((theme) => theme.name) || [];
  const status = watch("status") || userGame?.status;
  const isLoadingRef = useRef(false);
  const [open, setOpen] = useState(false);

  function handleAddGame(data) {
    console.log(data);
    if (isLoadingRef.current === true) return;
    isLoadingRef.current = true;
    data.date_finished = new Date(data.date_finished)
      .toISOString()
      .split("T")[0];
    toast
      .promise(
        async () => {
          const { error } = await addGame({
            game_id,
            user_id,
            genres,
            themes,
            game_name,
            game_cover: game_cover,
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
        const gameId = String(game_id);
        queryClient.invalidateQueries({
          queryKey: ["user_game", user_id, gameId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user_games", user_id],
        });
        isLoadingRef.current = false;
      });
  }

  function handleUpdateGame(data) {
    if (isLoadingRef.current === true) return;
    isLoadingRef.current = true;
    data.date_finished = new Date(data.date_finished)
      .toISOString()
      .split("T")[0];
    toast
      .promise(
        async () => {
          const { error } = await updateUserGame({
            game_id,
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
        const gameId = String(game_id);
        queryClient.invalidateQueries({
          queryKey: ["user_game", user_id, gameId],
        });
        queryClient.invalidateQueries({
          queryKey: ["user_games", user_id],
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
        <Button
          className={`bg-bg-surface border-stroke-subtle
            hover:bg-bg-surface/75 cursor-pointer rounded-full border py-6
          text-xl tracking-wide backdrop-blur-md hover:backdrop-blur-xs md:px-10!`}
        >
          <span>{isUpdate ? <FaPen /> : <FaPlus />}</span>
          <span className="hidden md:inline">
            {isUpdate ? "Update Game" : "Add Game"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-bg-card border-stroke-medium border backdrop-blur-xl sm:max-w-xl md:max-w-3xl lg:max-w-4xl">
        <div className="flex w-full items-start gap-x-10">
          {/* Game Data */}
          <div className="hidden h-full flex-col items-start justify-between sm:flex">
            <img
              src={game_cover}
              className="w-70 rounded-xl object-contain"
              alt=""
              fetchPriority="high"
            />

            <div className="flex flex-col gap-1">
              <h3>{game_name}</h3>
              <p>
                Release Date:{" "}
                {new Date(releaseDate * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Game Form */}
          <form
            onSubmit={handleSubmit(isUpdate ? handleUpdateGame : handleAddGame)}
            className="w-full"
          >
            <div className="grid w-full gap-4">
              {/* Form header */}
              <div className="flex w-full flex-col items-center justify-center gap-1">
                <h2>{isUpdate ? "Update Game" : "Add Game"}</h2>
                <p>
                  {isUpdate
                    ? "Update game details"
                    : "Add a new game to your list."}
                </p>
              </div>

              {/* Status and Rating fields */}
              <div className="justify flex flex-col items-start gap-3 md:flex-row md:items-center">
                {/* Status field */}
                <div className="flex w-full flex-col gap-3 md:w-fit">
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
                <div className="flex-1"></div>
                {/* Rating field */}
                <div className="flex w-full flex-col gap-3 md:w-[40%]">
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
              {/* Hours Played field */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hours_played">Hours Played *</Label>
                  {errors["hours_played"] && (
                    <p className="text-error text-sm leading-0">
                      {errors["hours_played"].message}
                    </p>
                  )}
                </div>
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
              </div>
              {/* Date Finished field */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="date_finished">Date {status}</Label>
                  {errors["date_finished"] && (
                    <p className="text-error text-sm leading-0">
                      {errors["date_finished"].message}
                    </p>
                  )}
                </div>
                <ModalDate
                  name="date_finished"
                  control={control}
                  disabled={status === "playing" || status === undefined}
                  minDate={releaseDate}
                  defaultValue={userGame?.date_finished || null}
                />
              </div>
            </div>
            {/* Form footer */}
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <button className=" bg-bg-card border-stroke-subtle cursor-pointer rounded-full border px-5 py-2">
                  Cancel
                </button>
              </DialogClose>
              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoadingRef.current}
                className="bg-pulse-primary cursor-pointer rounded-full px-5 py-2"
              >
                {isUpdate ? "Update Game" : "Add Game"}
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddGameModal;
