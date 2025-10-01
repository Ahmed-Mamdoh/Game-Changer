import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthFormCard from "./ui/AuthFormCard";
import { useForm } from "react-hook-form";
import AuthFormField from "./ui/AuthFormField";
import SignupForm from "./SignupForm";

export function AuthForm() {
  const { register, handleSubmit, formState } = useForm();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-5">
      <Tabs defaultValue="login">
        <TabsList className="bg-bg-secondary text-text-general w-full">
          <TabsTrigger
            className="text-text-general data-[state=active]:bg-gray-600"
            value="login"
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="text-text-general data-[state=active]:bg-gray-600"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleSubmit((data) => console.log(data))}>
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
        </TabsContent>

        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
