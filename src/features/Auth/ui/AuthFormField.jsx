import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

function AuthFormField({ field, validations, register, formState }) {
  const { errors } = formState;
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label htmlFor={field}>
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </Label>
        {errors?.[field]?.message && (
          <p className="w-fit rounded-full bg-red-900 px-3 py-1 text-sm">
            {errors[field].message}
          </p>
        )}
      </div>
      <Input
        id={field}
        type={
          field === "email"
            ? "email"
            : field.includes("password")
              ? "password"
              : "text"
        }
        className="border-gray-500"
        {...register(field, {
          required: `${field} is required`,
          ...validations,
        })}
      />
    </div>
  );
}

export default AuthFormField;
