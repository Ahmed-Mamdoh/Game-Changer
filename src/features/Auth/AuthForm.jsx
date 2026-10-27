import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

export function AuthForm() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="bg-bg-surface/95 border-stroke-subtle flex w-full max-w-md flex-col rounded-xl border p-6 shadow-[var(--shadow-float)] backdrop-blur-md md:p-8">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <h1 className="mb-1 text-[length:var(--font-size-title)] font-semibold tracking-tight">
          {activeTab === "login" ? "Sign in" : "Create your library"}
        </h1>
        <p className="mb-5 text-sm">
          {activeTab === "login"
            ? "Pick up where you left off: your games, hours and reviews."
            : "Free. Log what you play, track hours, get picks based on your games."}
        </p>
        <TabsList className="bg-bg-base border-stroke-subtle mb-2 h-10 w-full rounded-lg border p-[3px]">
          <TabsTrigger
            className="text-text-dim data-[state=active]:bg-action data-[state=active]:text-on-action cursor-pointer rounded-md border-0 font-semibold"
            value="login"
          >
            Sign in
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="text-text-dim data-[state=active]:bg-action data-[state=active]:text-on-action cursor-pointer rounded-md border-0 font-semibold"
          >
            Create account
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
