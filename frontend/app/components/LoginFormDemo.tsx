"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";

interface LoginFormDemoProps {
  toggleForm: () => void; // Function to switch to the signup form
}

const LoginFormDemo: React.FC<LoginFormDemoProps> = ({ toggleForm }) => {
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-lg p-4 bg-white dark:bg-black shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
        Login to Aceternity
      </h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="Enter your email" type="email" />
        </div>
        <div className="mb-6">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="Enter your password" type="password" />
        </div>
        <Button type="submit" className="w-full bg-black text-white">
          Login
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Don't have an account?{" "}
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:underline"
          >
            Sign up here
          </button>
        </p>
      </div>

      <div className="my-4 text-center">
        <p className="text-sm text-neutral-500">Or login with</p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button variant="outline" className="flex items-center space-x-2">
          <IconBrandGoogle className="w-5 h-5" />
          <span>Google</span>
        </Button>
        <Button variant="outline" className="flex items-center space-x-2">
          <IconBrandGithub className="w-5 h-5" />
          <span>GitHub</span>
        </Button>
      </div>
    </div>
  );
};

export default LoginFormDemo;
