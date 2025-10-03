import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

export function AuthForm() {
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
          <LoginForm />
        </TabsContent>

        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
