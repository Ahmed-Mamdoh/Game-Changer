import { Label } from "@radix-ui/react-label";

function AuthFormField({ field, validations, register, formState }) {
  const { errors } = formState;
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={field} className="text-text-main text-sm font-semibold">
        {(field.charAt(0).toUpperCase() + field.slice(1)).replace(
          /([a-z])([A-Z])/g,
          "$1 $2",
        )}
      </Label>
      <input
        id={field}
        type={
          field === "email"
            ? "email"
            : field.includes("password")
              ? "password"
              : "text"
        }
        aria-invalid={Boolean(errors?.[field])}
        aria-describedby={errors?.[field] ? `${field}-error` : undefined}
        className="border-stroke-medium bg-bg-base focus-visible:border-stroke-brand aria-invalid:border-pulse-error h-11 rounded-md border px-3 transition-colors duration-100 focus-visible:outline-none"
        {...register(field, {
          required: `${field} is required`,
          ...validations,
        })}
      />
      {errors?.[field]?.message && (
        <p id={`${field}-error`} className="text-text-error text-sm">
          {errors[field].message}
        </p>
      )}
    </div>
  );
}

export default AuthFormField;
