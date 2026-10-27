import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

// Reads and writes one filter in the URL. `or` = pick one, otherwise many.
function useFilterParam(paramName, or, defaultValue) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.get(paramName)?.split("-") || defaultValue;

  function toggle(id) {
    const value = String(id);
    const newParams = new URLSearchParams(searchParams);
    const current = searchParams.get(paramName)?.split("-") || [];
    newParams.delete("page");

    if (or) {
      if (current.includes(value) || defaultValue.includes(value)) {
        newParams.delete(paramName);
      } else {
        newParams.set(paramName, value);
      }
    } else {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (next.length) newParams.set(paramName, next.join("-"));
      else newParams.delete(paramName);
    }
    setSearchParams(newParams);
  }

  return { selected, toggle };
}

function FilterButtons({
  category = [],
  name,
  paramName,
  sort = true,
  or = false,
  defaultValue = [],
  variant = "menu",
}) {
  const { selected, toggle } = useFilterParam(paramName, or, defaultValue);
  const options = [...category].sort((a, b) =>
    sort ? a.name.localeCompare(b.name) : 0,
  );
  const isOn = (item) => selected.includes(String(item.id));

  // Few view-like options: show them all as a segmented control
  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label={name}
        className="segmented h-10 bg-transparent backdrop-blur-none"
      >
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={isOn(item)}
            onClick={() => !isOn(item) && toggle(item.id)}
            className="h-8!"
          >
            {item.name}
          </button>
        ))}
      </div>
    );
  }

  const activeItems = options.filter(
    (item) => isOn(item) && !defaultValue.includes(String(item.id)),
  );
  const label =
    activeItems.length === 0
      ? name
      : activeItems.length === 1
        ? activeItems[0].name.split("(")[0].trim()
        : `${name} · ${activeItems.length}`;

  return (
    <Popover>
      <PopoverTrigger
        className={`flex h-10 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm whitespace-nowrap transition-colors duration-100 ${
          activeItems.length
            ? "border-stroke-brand text-text-main bg-white/[0.06] font-semibold"
            : "border-stroke-subtle text-text-dim hover:text-text-main hover:bg-white/[0.04]"
        }`}
      >
        {label}
        <ChevronDown className="h-4 w-4 opacity-70" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="bg-bg-raised border-stroke-medium text-text-main w-64 rounded-lg p-1 shadow-[var(--shadow-float)]"
      >
        <div
          role={or ? "radiogroup" : "group"}
          aria-label={name}
          className="max-h-80 overflow-y-auto"
        >
          {options.map((item) => {
            const on = isOn(item);
            return (
              <button
                key={item.id}
                type="button"
                role={or ? "radio" : "checkbox"}
                aria-checked={on}
                onClick={() => toggle(item.id)}
                className="hover:bg-bg-chip flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-sm px-2.5 text-left text-sm"
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                    or ? "rounded-full" : "rounded-[4px]"
                  } ${on ? "bg-action border-action text-on-action" : "border-stroke-medium"}`}
                >
                  {on && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                {item.name}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default FilterButtons;
