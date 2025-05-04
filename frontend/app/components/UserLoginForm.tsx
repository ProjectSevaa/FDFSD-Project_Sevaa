import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // Import the context
import { BASE_URL } from "@/constants";

interface UserLoginFormProps {
    toggleForm: () => void;
}

const UserLoginForm: React.FC<UserLoginFormProps> = ({ toggleForm }) => {
    const { setEmail } = useUser(); // Access setEmail from UserContext
    const [email, setLocalEmail] = useState(""); // Local state for email
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false); // State to control error visibility
    const router = useRouter(); // Next.js routing

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setShowError(false); // Hide errors initially

        try {
            // Save the email to context
            setEmail(email);

            const response = await fetch(`${BASE_URL}/auth/userLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include", // Include cookies for authentication
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            const result = await response.json();

            // Show a success message (e.g., via toast)
            console.log("Login Successful!", result);

            // Redirect to the specified page or a default dashboard
            if (result.redirectTo) {
                router.push(result.redirectTo);
            } else {
                router.push("/");
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred"
            );
            setShowError(true); // Show error after form submission
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black text-white border-2 border-black">
            <div className="modal-header">
                <h5 className="font-bold text-xl text-neutral-200">
                    User Login
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
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-neutral-200 font-semibold mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setLocalEmail(e.target.value)} // Set the local state for email
                            placeholder="Enter your email"
                            required
                            className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="passwordLogin"
                            className="block text-neutral-200 font-semibold mb-2"
                        >
                            Password
                        </label>
                        <input
                            id="passwordLogin"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    {showError && error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}
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
                    <div className="text-center mt-3" id="signupLinkContainer">
                        <p>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="btn btn-link text-blue-500 hover:text-blue-700"
                                onClick={toggleForm}
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserLoginForm;
