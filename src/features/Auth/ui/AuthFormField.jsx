import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

function AuthFormField({ field, validations, register, formState }) {
  const { errors } = formState;
  return (
    <div className="grid">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label htmlFor={field}>
          {field.charAt(0).toUpperCase() + field.slice(1)}:
        </Label>
        {errors?.[field]?.message && (
          <p className=" text-text-error rounded-full px-3 py-1 text-[1rem] font-medium tracking-wide">
            {errors[field].message}
          </p>
        )}
      </div>
      <input
        id={field}
        type={
          field === "email"
            ? "email"
            : field.includes("password")
              ? "password"
              : "text"
        }
        className="border-stroke-subtle bg-bg-card
        focus-visible:border-pulse-primary hover:border-pulse-primary/50 rounded-full border-1 px-4
        py-1.5 transition-all duration-200 focus-visible:outline-none"
        {...register(field, {
          required: `${field} is required`,
          ...validations,
        })}
      />
    </div>
  );
}

export default AuthFormField;
