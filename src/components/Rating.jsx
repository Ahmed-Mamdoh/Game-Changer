import { useController } from "react-hook-form";

function Rating({ defaultValue, control, name }) {
  const { field } = useController({
    name,
    control,
    defaultValue: defaultValue,
    rules: {
      required: "Rating is required",
    },
  });
  console.log(field.value);
  return (
    <div className="rating rating-lg">
      {[1, 2, 3, 4, 5].map((num) => (
        <input
          key={num}
          type="radio"
          name="rating-1"
          className="mask mask-star-2 bg-pulse-primary"
          aria-label={`${num} star`}
          checked={field.value === num}
          onClick={() => {
            field.onChange(num === field.value ? "" : num);
          }}
        />
      ))}
    </div>
  );
}

export default Rating;
