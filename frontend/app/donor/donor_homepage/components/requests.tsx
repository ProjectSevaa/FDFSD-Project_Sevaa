"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Cookies from "js-cookie";
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
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from "@/context/UserContext"; // Import the useUser hook
import { fetchCsrfToken } from "@/utils/csrf";
import { apiFetch } from "@/utils/api";
import { BASE_URL } from "@/constants";

const formSchema = z.object({
    donorEmail: z.string().email({ message: "Invalid email address" }),
    location: z.string().optional(),
    availableFood: z.string().min(1, { message: "Available food is required" }),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

export function RequestsSection() {
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const { toast } = useToast();
    const { email } = useUser(); // Get email from UserContext

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            donorEmail: email || "",
            location: "",
            availableFood: "",
            latitude: "",
            longitude: "",
        },
    });

    useEffect(() => {
        const init = async () => {
            await fetchCsrfToken();

            // If email is available from context, set it in the form
            if (email) {
                form.setValue("donorEmail", email);
            }
        };

        init();
    }, [email, form]);

    useEffect(() => {
        // If email is available from context, set it in the form
        if (email) {
            form.setValue("donorEmail", email);
        }
    }, [email, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await fetch(`${BASE_URL}/post/createPost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    donorEmail: values.donorEmail,
                    location: values.location,
                    availableFood: values.availableFood,
                    longitude: values.longitude,
                    latitude: values.latitude,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Post created successfully",
                    description:
                        "Your post has been created and is now visible to users.",
                });
                form.reset(); // Reset form after successful submission
            } else {
                const errorData = await response.json();
                toast({
                    title: "Error creating post",
                    description:
                        errorData.message || "An unknown error occurred",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.log("Error creating post:", error);
            toast({
                title: "Error",
                description: "Failed to create post. Please try again later.",
                variant: "destructive",
            });
        }
    }

    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude.toString();
                    const longitude = position.coords.longitude.toString();
                    form.setValue("latitude", latitude);
                    form.setValue("longitude", longitude);
                    toast({
                        title: "Location set",
                        description: "Your current location has been set.",
                    });
                    setIsGettingLocation(false);
                },
                () => {
                    toast({
                        title: "Error",
                        description: "Unable to retrieve your location.",
                        variant: "destructive",
                    });
                    setIsGettingLocation(false);
                }
            );
        } else {
            toast({
                title: "Error",
                description: "Geolocation is not supported by this browser.",
                variant: "destructive",
            });
            setIsGettingLocation(false);
        }
    };

    return (
        <div className="flex justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create a Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="donorEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Donor Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Location (optional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter location"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            You can also use the button below to
                                            get your current location.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="availableFood"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Available Food (comma-separated)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter available food"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="hidden" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="longitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="hidden" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col space-y-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={getCurrentLocation}
                                    disabled={isGettingLocation}
                                >
                                    {isGettingLocation
                                        ? "Getting Location..."
                                        : "Get Current Location"}
                                </Button>
                                <Button type="submit">Create Post</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
