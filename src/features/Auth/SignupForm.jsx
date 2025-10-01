import { signUp } from "@/api/supabase";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthFormCard from "./ui/AuthFormCard";
import AuthFormField from "./ui/AuthFormField";
import { useState } from "react";

function SignupForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(formData) {
    if (isLoading) return;

    setIsLoading(true);
    const userData = await toast
      .promise(
        async () => {
          const response = await signUp({
            email: formData.email,
            password: formData.password,
            username: formData.username,
          });
          if (response.error) {
            throw new Error(response.error.message);
          }
          return response.data;
        },
        {
          loading: "Loading",
          success: "Account Created Successfully",
          error: (error) => error.message,
        },
      )
      .finally(() => {
        setIsLoading(false);
      });

    if (userData) {
      navigate("/");
    }
  }

  return (
    <form onSubmit={handleSubmit((data) => handleSignup(data))}>
      <AuthFormCard
        btnText="Sign Up"
        title="Sign Up"
        description=" Create a new account to get started. Join us and enjoy all the
                features."
      >
        <AuthFormField
          field={"username"}
          register={register}
          formState={formState}
        />

        <AuthFormField
          field={"email"}
          register={register}
          formState={formState}
          validations={{
            validate: (value) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
              "Please enter a valid email address",
          }}
        />
        <AuthFormField
          field={"password"}
          register={register}
          formState={formState}
          validations={{
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
        />
        <AuthFormField
          field={"confirm password"}
          register={register}
          formState={formState}
          {...register("confirm password", {
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
      </AuthFormCard>
    </form>
  );
}

export default SignupForm;
