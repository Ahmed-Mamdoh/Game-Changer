import { useController } from "react-hook-form";

import { FaCheck } from "react-icons/fa";

function ModalSelect({ control, name, defaultValue }) {
  const { field } = useController({
    name,
    control,
    defaultValue: defaultValue,
    rules: {
      required: "Status is required",
    },
  });
  return (
    <div className="flex items-center gap-x-2">
      {["playing", "finished", "dropped"].map((item) => (
        <button
          className={`border-obsidian-border hover:bg-pulse-primary/30
            bg-myGray/70
        hover:shadow-pulse-primary/60 flex cursor-pointer items-center gap-2 rounded-full border-2
        px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 hover:scale-105
        
        ${field.value === item ? "bg-pulse-primary/50 shadow-pulse-primary/20 " : ""}`}
          onClick={() => field.onChange(item)}
        >
          {field.value === item ? <FaCheck className="h-3 w-3" /> : null}
          {item}
        </button>
      ))}
    </div>
  );
}

export default ModalSelect;
