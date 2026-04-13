import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ModalSelect from "../ui/ModalSelect";
import ModalDate from "../ui/ModalDate";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addGame, updateUserGame } from "@/api/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FaEdit, FaPen, FaPlus, FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AddGameModal({
  game_id,
  releaseDate,
  genresData,
  themesData,
  game_name,
  game_cover,
  isUpdate = false,
  userGame,
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
          className={`bg-obsidian-muted/75 border-obsidian-border text-text-primary
            hover:bg-obsidian-muted/40 cursor-pointer rounded-full border-1 py-6
          text-xl tracking-wide backdrop-blur-md hover:backdrop-blur-xs md:px-10!`}
        >
          <span>{isUpdate ? <FaPen /> : <FaPlus />}</span>
          <span className="hidden md:inline">
            {isUpdate ? "Update Game" : "Add Game"}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-obsidian-card/70 border-0 backdrop-blur-sm sm:max-w-4xl">
        <div className="flex w-full items-start gap-x-10">
          <div className="flex h-full flex-col items-start justify-between">
            <img
              src={game_cover}
              className="w-70 rounded-md object-contain"
              alt=""
              fetchPriority="high"
            />

            <div className="flex flex-col gap-1">
              <p className="text-2xl">{game_name}</p>
              <p className="text-text-secondary text-md">
                Release Date:{" "}
                {new Date(releaseDate * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          {user_id ? (
            <form
              onSubmit={handleSubmit(
                isUpdate ? handleUpdateGame : handleAddGame,
              )}
              className="w-full"
            >
              <div className="grid gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-4xl">
                    {isUpdate ? "Update Game" : "Add Game"}
                  </p>
                  <p className="text-text-secondary text-lg">
                    {isUpdate
                      ? "Update game details"
                      : "Add a new game to your list."}
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status *</Label>
                    {errors["status"] && (
                      <p className="text-error text-sm">
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
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hours_played">Hours Played *</Label>
                    {errors["hours_played"] && (
                      <p className="text-error text-sm">
                        {errors["hours_played"].message}
                      </p>
                    )}
                  </div>
                  <Input
                    id="hours_played"
                    name="hours_played"
                    type="number"
                    className="border-obsidian-border bg-myGray/70  rounded-full border-2 focus-visible:ring-0"
                    min={1}
                    defaultValue={userGame?.hours_played || ""}
                    {...register("hours_played", {
                      required: "Hours played is required",
                    })}
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="date_finished">Date {status}</Label>
                    {errors["date_finished"] && (
                      <p className="text-error text-sm">
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
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <button className=" bg-myGray/70 border-obsidian-border cursor-pointer rounded-full border px-4 py-2">
                    Cancel
                  </button>
                </DialogClose>

                <button
                  type="submit"
                  disabled={isLoadingRef.current}
                  className="bg-pulse-secondary cursor-pointer rounded-full px-5 py-1"
                >
                  {isUpdate ? "Update Game" : "Add Game"}
                </button>
              </DialogFooter>
            </form>
          ) : (
            <p className="text-text-subtle">Please login to add a game.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddGameModal;
