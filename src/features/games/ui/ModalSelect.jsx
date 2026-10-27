import { useController } from "react-hook-form";

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
    <div
      role="radiogroup"
      aria-label="Status"
      className="segmented bg-bg-base backdrop-blur-none"
    >
      {["playing", "finished", "dropped"].map((item) => (
        <button
          type="button"
          role="radio"
          aria-checked={field.value === item}
          key={item}
          onClick={(e) => {
            e.preventDefault();
            field.onChange(item);
          }}
        >
          {{ playing: "Playing", finished: "Played", dropped: "Dropped" }[item]}
        </button>
      ))}
    </div>
  );
}

export default ModalSelect;
