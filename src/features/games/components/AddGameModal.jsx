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
import { addGame } from "@/api/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

function AddGameModal({
  game_id,
  releaseDate,
  genresData,
  themesData,
  game_name,
  game_cover,
}) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState, control, watch } = useForm();
  const { errors } = formState;
  const userToken = localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token");
  const user_id = JSON.parse(userToken || "{}")?.user?.id;
  const genres = genresData.map((genre) => genre.name);
  const themes = themesData.map((theme) => theme.name);
  const status = watch("status");
  console.log(status);
  const isLoadingRef = useRef(false);

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
            game_cover: game_cover.url,
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary text-primary-content cursor-pointer px-6 py-3 text-xl font-bold hover:rounded-xl">
          Add Game
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-base-200 border-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Game</DialogTitle>
          <DialogDescription className="text-base-content/80">
            Add a new game to your list.
          </DialogDescription>
        </DialogHeader>
        {user_id ? (
          <form onSubmit={handleSubmit((data) => handleAddGame(data))}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Status *</Label>
                  {errors["status"] && (
                    <p className="text-error text-sm">
                      {errors["status"].message}
                    </p>
                  )}
                </div>
                <ModalSelect control={control} name="status" />
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
                  min={1}
                  {...register("hours_played", {
                    required: "Hours played is required",
                  })}
                />
              </div>
              {status !== "playing" && (
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
                    minDate={releaseDate}
                  />
                </div>
              )}
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button className="base-content cursor-pointer border bg-transparent hover:bg-transparent">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isLoadingRef.current}
                className="bg-primary hover:bg-primary text-primary-content cursor-pointer font-extrabold"
              >
                Add Game
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <p className="text-text-subtle">Please login to add a game.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddGameModal;
