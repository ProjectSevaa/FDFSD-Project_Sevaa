"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/constants";

// Define the schema using Zod for validation
const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    mobileNumber: z.string().min(10, { message: "Mobile number is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
        .string()
        .min(3, { message: "Password must be at least 3 characters." }),
    address: z.object({
        doorNo: z.string().min(1, { message: "Door number is required." }),
        street: z.string().min(1, { message: "Street is required." }),
        landmarks: z.string().optional(),
        townCity: z.string().min(1, { message: "Town/City is required." }),
        state: z.string().min(1, { message: "State is required." }),
        pincode: z.string().min(1, { message: "Pincode is required." }),
    }),
});

export default function InputForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            mobileNumber: "",
            email: "",
            password: "",
            address: {
                doorNo: "",
                street: "",
                landmarks: "",
                townCity: "",
                state: "",
                pincode: "",
            },
        },
    });

    // Submit handler
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const response = await fetch(`${BASE_URL}/auth/userSignup`, {
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
                // Optionally redirect or handle further UI updates
            } else {
                const errorData = await response.json();
                toast({
                    title: "Signup Failed",
                    description:
                        errorData.message ||
                        "Something went wrong. Please try again.",
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

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-1/3 space-y-6">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    User Signup
                </h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-2/3 space-y-6"
                    >
                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This will be your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Mobile Number Field */}
                        <FormField
                            control={form.control}
                            name="mobileNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mobile Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your mobile number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your phone number for account
                                        verification.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        We'll send you account-related updates
                                        here.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your password for login.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address Fields */}
                        <FormField
                            control={form.control}
                            name="address.doorNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Door Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your door number"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your door number for address
                                        verification.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address.street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your street"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Your street address for location
                                        purposes.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address.townCity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Town/City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your town or city"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The town or city of your address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address.state"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your state"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The state of your address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address.pincode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pincode</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your pincode"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The pincode of your address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Sign Up</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
