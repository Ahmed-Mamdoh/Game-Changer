import { ChevronDownIcon, Trash, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useController } from "react-hook-form";
import { MyDatePicker } from "./MyDatePicker";
import { CiTrash } from "react-icons/ci";

function ModalDate({ name, control, minDate, defaultValue, disabled }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(
    defaultValue ? new Date(defaultValue) : null,
  );
  const { field } = useController({
    name,
    control,
    defaultValue: defaultValue ? new Date(defaultValue) : null,
    rules: {
      validate: (value) =>
        value === null
          ? true
          : new Date(value) >= new Date()
            ? "Date cant be in the future"
            : new Date(value) >= new Date(minDate * 1000)
              ? true
              : "Date must be after the release date",
    },
  });

  return (
    <div className="flex  items-center gap-3">
      <div className="w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              disabled={disabled}
              className=" bg-bg-card border-stroke-subtle w-full justify-between rounded-full border"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <div className="flex items-center gap-2">
                <ChevronDownIcon />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-bg-card border-stroke-subtle w-auto overflow-hidden border p-0 backdrop-blur-xl"
            align="start"
          >
            <MyDatePicker
              onSelect={(date) => {
                field.onChange(date);
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Trash
        className="text-text-error h-5 w-5 cursor-pointer"
        onClick={() => {
          setDate(null);
          field.onChange(null);
        }}
      />
    </div>
  );
}

export default ModalDate;
