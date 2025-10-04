import * as React from "react";
import { useController } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ModalSelect({ control, name }) {
  const { field } = useController({
    name,
    control,
    defaultValue: "",
    rules: {
      required: "Status is required",
    },
  });

  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="bg-base-100">
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem className="focus:bg-base-300" value="Finished">
            Finished
          </SelectItem>
          <SelectItem className="focus:bg-base-300" value="Playing">
            Playing
          </SelectItem>
          <SelectItem className="focus:bg-base-300" value="Dropped">
            Dropped
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ModalSelect;
