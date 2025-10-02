import { logIn } from "@/api/supabase";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthFormCard from "./ui/AuthFormCard";
import AuthFormField from "./ui/AuthFormField";

function LoginForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(formData) {
    if (isLoading) return;

    setIsLoading(true);
    const userData = await toast
      .promise(
        async () => {
          const response = await logIn({
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
    <form onSubmit={handleSubmit((data) => handleLogin(data))}>
      <AuthFormCard
        btnText="Login"
        title="Login"
        description=" Welcome back! Please enter your credentials to access your
                account."
      >
        <AuthFormField
          field={"email"}
          register={register}
          formState={formState}
        />
        <AuthFormField
          field={"password"}
          register={register}
          formState={formState}
        />
      </AuthFormCard>
    </form>
  );
}

export default LoginForm;
