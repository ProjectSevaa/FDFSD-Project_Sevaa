"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoginForm } from "./components/LoginForm";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InputForm() {
  const { toast } = useToast();
  const { email, setEmail } = useUser(); // Use the User Context for email
  const [formStep, setFormStep] = useState<"email" | "password">("email");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const router = useRouter(); // Use Next.js router for navigation

  const handleSubmit = async (data: { email?: string; password?: string }) => {
    if (formStep === "email" && data.email) {
      setEmail(data.email); // Update email in context
      toast({
        title: "Email Submitted",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
      setFormStep("password"); // Move to password step
    } else if (formStep === "password" && data.password) {
      setPassword(data.password); // Save the password
      setIsLoading(true); // Set loading state
      try {
        const response = await fetch("http://localhost:9500/auth/userLogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password: data.password }),
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          toast({
            title: "Login Successful!",
            description: "Redirecting to the user homepage...",
          });

          // Check for the redirectTo key and redirect
          if (result.redirectTo) {
            router.push(result.redirectTo); // Redirect to the specified page
          }
        } else {
          const errorData = await response.json();
          toast({
            title: "Login Failed",
            description: errorData.message || "Unknown error occurred.",
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
      } finally {
        setIsLoading(false); // Reset loading state
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-1/3 space-y-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          User Login
        </h1>
        <LoginForm formStep={formStep} onSubmit={handleSubmit} />
        <Button variant="link" asChild>
          <Link href="/user_signup">Create User Account?</Link>
        </Button>
        {isLoading && (
          <div className="mt-4 text-center text-blue-500">Logging in...</div>
        )}
      </div>
    </div>
  );
}
