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

function ModalDate({ name, control, minDate, defaultValue }) {
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
            className="hover:text-base-content w-full justify-between bg-transparent font-normal hover:bg-transparent"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-base-100 w-auto overflow-hidden p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={defaultValue || field.value}
            className="bg-base-100"
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
