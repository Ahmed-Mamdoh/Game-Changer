"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { memo } from "react";

export const Combobox = memo(function Combobox({ options, paramName }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  function handleSelect(newValue) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(paramName, newValue);
    newParams.delete("page");
    setSearchParams(newParams);
  }

  useEffect(() => {
    const param = searchParams.get(paramName);
    if (param) setValue(param);
    else setValue("");
  }, [searchParams, paramName]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="hover:bg-base-200 hover:base-content font-semibold"
        asChild
      >
        <Button
          variant="outline"
          role="combobox"
          aria-label={`Select ${paramName}`}
          aria-labelledby={`Select ${paramName}`}
          aria-expanded={open}
          className="bg-neutral w-8/12 justify-between overflow-hidden sm:w-48"
        >
          {value
            ? options.find((option) => option.id == value)?.name
            : `Select ${paramName}...`}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-0">
        <Command className="bg-neutral base-content">
          <CommandInput
            className="placeholder:base-content"
            placeholder={`Search ${paramName}...`}
          />
          <CommandList className="bg-neutral">
            <CommandEmpty className="base-content p-4">
              No option found.
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  className="base-content data-[selected=true]:bg-base-300 font-medium"
                  onSelect={() => {
                    if (option.id == value) {
                      setValue("");
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete(paramName);
                      setSearchParams(newParams);
                      setOpen(false);
                    } else {
                      setOpen(false);
                      handleSelect(option.id);
                      setValue(option.id);
                    }
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value == option.id
                        ? "base-content opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
