"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  deliveryBoyName: z.string().min(1, "Delivery Boy Name is required"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  deliveryBoyName: z.string().min(1, "Delivery Boy Name is required"),
  passwordDel: z.string().min(6, "Password must be at least 6 characters"),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number"),
  vehicleNo: z.string().min(1, "Vehicle Number is required"),
  drivingLicenseNo: z.string().min(1, "Driving License Number is required"),
  longitude: z.number(),
  latitude: z.number(),
});

export default function DeliveryBoyAuth() {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      deliveryBoyName: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      deliveryBoyName: "",
      passwordDel: "",
      mobileNumber: "",
      vehicleNo: "",
      drivingLicenseNo: "",
      longitude: 0,
      latitude: 0,
    },
  });

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const response = await fetch("http://localhost:9500/auth/delLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include", // Ensure cookies are included
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
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
        description: "Failed to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const onSignupSubmit = async (data: z.infer<typeof signupSchema>) => {
    try {
      const response = await fetch("http://localhost:9500/auth/delSignup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Signup Successful",
          description: "Your account has been created successfully.",
        });
        setIsSignupOpen(false);
        // Optionally redirect to login or dashboard
      } else {
        const errorData = await response.json();
        toast({
          title: "Signup Failed",
          description:
            errorData.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          signupForm.setValue("latitude", position.coords.latitude);
          signupForm.setValue("longitude", position.coords.longitude);
          toast({
            title: "Location Obtained",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: `Failed to get location: ${error.message}`,
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Delivery Boy Login</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="deliveryBoyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Boy Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showLoginPassword && (
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showLoginPassword ? (
                <Button
                  type="button"
                  onClick={() => setShowLoginPassword(true)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">Login</Button>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p>Don't have an account?</p>
          <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
            <DialogTrigger asChild>
              <Button variant="link">Sign up</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delivery Boy Sign Up</DialogTitle>
                <DialogDescription>
                  Create your account to get started.
                </DialogDescription>
              </DialogHeader>
              <Form {...signupForm}>
                <form
                  onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={signupForm.control}
                    name="deliveryBoyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Boy Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="passwordDel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="vehicleNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="drivingLicenseNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driving License Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <h3 className="text-lg font-medium">Current Location</h3>
                    <Button
                      type="button"
                      onClick={getLocation}
                      className="mt-2"
                    >
                      Get Current Location
                    </Button>
                  </div>
                  <Button type="submit">Sign Up</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
