// components/DonorLoginForm.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Using next/router for routing
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext"; // Import the UserContext
import { toast } from "@/hooks/use-toast";

interface DonorLoginFormProps {
    toggleForm: () => void; // Callback to toggle between login/signup forms
}

const DonorLoginForm: React.FC<DonorLoginFormProps> = ({ toggleForm }) => {
    const { email, setEmail } = useUser(); // Use the UserContext for email
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Handle form submission (login logic)
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                "http://localhost:9500/auth/donorLogin",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    title: "Login Failed",
                    description: errorData.message || "Invalid credentials",
                    variant: "destructive",
                });
                router.push("/"); // Redirect to home on failed login
                return;
            }

            const result = await response.json();

            // Show a success message (e.g., via toast)
            console.log("Login Successful!", result);

            // Redirect to the specified page or a default dashboard
            if (result.redirectTo) {
                router.push(result.redirectTo);
            } else {
                router.push("/donor/donor_homepage"); // Change this to the correct donor homepage
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black text-white border-2 border-black">
            <div className="modal-header">
                <h5 className="font-bold text-xl text-neutral-200">
                    Donor Login
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    style={{ color: "#fff" }}
                    onClick={toggleForm}
                ></button>
            </div>
            <div className="modal-body">
                <form onSubmit={handleLogin} className="my-8">
                    {/* Email input */}
                    <div className="mb-4">
                        <Label
                            htmlFor="emailLogin"
                            className="block text-neutral-200 font-semibold mb-2"
                        >
                            Email:
                        </Label>
                        <Input
                            type="email"
                            id="emailLogin"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Use setEmail from context
                            required
                            pattern=".+@food\.in$"
                            title="Email must end with @food.in"
                            placeholder="Enter your email"
                            className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password input */}
                    <div className="mb-4">
                        <Label
                            htmlFor="passwordLogin"
                            className="block text-neutral-200 font-semibold mb-2"
                        >
                            Password:
                        </Label>
                        <Input
                            type="password"
                            id="passwordLogin"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

                    {/* Login Button */}
                    <div className="d-flex justify-between items-center space-x-4 mb-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary text-white bg-gray-800 rounded-md py-2 px-4 hover:bg-gray-700"
                            onClick={toggleForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn btn-primary text-white bg-blue-600 rounded-md py-2 px-4 hover:bg-blue-700 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    {/* Sign-up Link */}
                    <div className="text-center mt-3">
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="btn btn-link text-blue-500 hover:text-blue-700"
                                onClick={toggleForm}
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DonorLoginForm;
