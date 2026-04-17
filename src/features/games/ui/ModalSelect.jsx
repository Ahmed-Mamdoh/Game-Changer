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
          className={`border-stroke-subtle bg-bg-card  hover:bg-pulse-primary
        flex cursor-pointer items-center gap-2 rounded-full border
        px-3 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 hover:scale-105
        
        ${field.value === item ? "bg-pulse-primary/50  " : ""}`}
          onClick={() => field.onChange(item)}
        >
          {field.value === item ? <FaCheck className="mt-0.5 h-3 w-3" /> : null}
          {item}
        </button>
      ))}
    </div>
  );
}

export default ModalSelect;
