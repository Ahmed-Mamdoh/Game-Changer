import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

export function AuthForm() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-5">
      <Tabs defaultValue="login">
        <TabsList className="bg-base-200 base-content w-full">
          <TabsTrigger
            className="base-content data-[state=active]:bg-base-100"
            value="login"
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="base-content data-[state=active]:bg-base-100"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>

        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
