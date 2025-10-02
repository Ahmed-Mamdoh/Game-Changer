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
import ModalSelect from "./ui/ModalSelect";
import ModalDate from "./ui/ModalDate";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addGame } from "@/api/supabase";

function AddGameModal({ game_id, releaseDate }) {
  const { register, handleSubmit, formState, control } = useForm();
  const { errors } = formState;
  const userToken = localStorage.getItem("sb-kapovyqqncfsoangqppi-auth-token");
  const user_id = JSON.parse(userToken || "{}")?.user?.id;

  function handleAddGame(data) {
    data.date_finished = new Date(data.date_finished)
      .toISOString()
      .split("T")[0];

    toast.promise(
      async () => {
        const { error } = await addGame({
          game_id,
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
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-accent-primary hover:bg-accent-primary cursor-pointer px-6 py-3 text-xl font-bold text-black hover:rounded-xl">
          Add Game
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-bg-secondary border-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Game</DialogTitle>
          <DialogDescription className="text-text-subtle">
            Add a new game to your list.
          </DialogDescription>
        </DialogHeader>
        {user_id ? (
          <form onSubmit={handleSubmit((data) => handleAddGame(data))}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Status</Label>
                  {errors["status"] && (
                    <p className="text-destructive text-sm">
                      {errors["status"].message}
                    </p>
                  )}
                </div>
                <ModalSelect control={control} name="status" />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hours_played">Hours Played</Label>
                  {errors["hours_played"] && (
                    <p className="text-destructive text-sm">
                      {errors["hours_played"].message}
                    </p>
                  )}
                </div>
                <Input
                  id="hours_played"
                  name="hours_played"
                  type="number"
                  min={0}
                  {...register("hours_played", {
                    required: "Hours played is required",
                  })}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="date_finished">Date Finished</Label>
                  {errors["date_finished"] && (
                    <p className="text-destructive text-sm">
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
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button className="text-text-general cursor-pointer border bg-transparent hover:bg-transparent">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-accent-primary hover:bg-accent-primary cursor-pointer font-extrabold text-black"
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
