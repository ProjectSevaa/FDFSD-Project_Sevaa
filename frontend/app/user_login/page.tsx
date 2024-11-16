"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { LoginForm } from "./components/LoginForm";

export default function InputForm() {
  const [formStep, setFormStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (data: {
    username?: string;
    password?: string;
  }) => {
    if ("username" in data && data.username) {
      setUsername(data.username); // Save the username
      toast({
        title: "Username Submitted",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      setFormStep("password"); // Move to password step
    } else if ("password" in data && data.password) {
      setPassword(data.password); // Save the password
      try {
        const response = await fetch("http://localhost:9000/auth/userLogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: username, password: data.password }),
        });

        if (response.ok) {
          const result = await response.json();
          toast({
            title: "Login Successful!",
            description: "Redirecting to the user homepage...",
          });
          window.location.href = "/user/user_homepage";
        } else {
          const errorData = await response.json();
          toast({
            title: "Login Failed",
            description: errorData.message || "Invalid credentials",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            "Failed to connect to the server. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-1/3 space-y-6">
        <LoginForm formStep={formStep} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
