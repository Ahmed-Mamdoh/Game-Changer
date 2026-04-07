import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

export function AuthForm() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="bg-obsidian-deep/50 border-obsidian-border mx-auto flex w-full max-w-lg flex-col gap-6 rounded-2xl border-2 px-8 py-5 backdrop-blur-xs">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <h2 className="text-center text-3xl ">
          {activeTab === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-text-secondary text-center">
          {activeTab === "login" ? "Log in to continue" : "Create a account"}
        </p>
        <TabsList className=" w-full">
          <TabsTrigger
            className="data-[state=active]:border-b-pulse-primary cursor-pointer rounded-none border-b-3 transition-all"
            value="login"
          >
            Log In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:border-b-pulse-primary cursor-pointer rounded-none border-b-3 transition-all"
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
