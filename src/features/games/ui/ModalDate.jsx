import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useController } from "react-hook-form";

function ModalDate({ name, control, minDate }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const { field } = useController({
    name,
    control,
    defaultValue: null,
    rules: {
      validate: (value) =>
        new Date(value) >= new Date()
          ? "Date cant be in the future"
          : new Date(value) >= new Date(minDate * 1000)
            ? true
            : "Date must be after the release date",
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between bg-transparent font-normal hover:bg-transparent hover:text-white"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            captionLayout="dropdown"
            onSelect={(date) => {
              field.onChange(date);
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ModalDate;
