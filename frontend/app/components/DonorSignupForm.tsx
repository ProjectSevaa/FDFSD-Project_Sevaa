import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/constants";

// Zod schema for form validation
const DonorFormSchema = z.object({
    username: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{2,14}$/, {
        message:
            "Username must start with a letter, and be 3-15 characters long.",
    }),
    mobileNumber: z.string().regex(/^(?!.*(.)\1{9})[6-9]\d{9}$/, {
        message:
            "Mobile number must be a valid 10-digit number starting with 6-9.",
    }),
    email: z
        .string()
        .email({ message: "Invalid email address." })
        .regex(/@food\.in$/, {
            message: "Email must be from the food.in domain.",
        }),
    password: z
        .string()
        .regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/,
            {
                message:
                    "Password must have at least 7 characters, including 1 uppercase, 1 number, and 1 symbol.",
            }
        ),
    address: z.object({
        doorNo: z.string().min(1, { message: "Door number is required." }),
        street: z.string().min(1, { message: "Street is required." }),
        landmarks: z.string().optional(),
        townCity: z.string().min(1, { message: "Town/City is required." }),
        state: z.string().min(1, { message: "State is required." }),
        pincode: z.string().regex(/^[1-9][0-9]{5}$/, {
            message: "Pincode must be a 6-digit number starting with non-zero.",
        }),
    }),
});

type DonorFormSchemaType = z.infer<typeof DonorFormSchema>;

interface DonorSignupFormProps {
    toggleForm: () => void;
}

const DonorSignupForm: React.FC<DonorSignupFormProps> = ({ toggleForm }) => {
    const form = useForm<DonorFormSchemaType>({
        resolver: zodResolver(DonorFormSchema),
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

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const onSubmit = async (data: DonorFormSchemaType) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/donorSignup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast({
                    title: "Signup Successful",
                    description: "Your account has been created successfully.",
                });
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
    };

    return (
        <div className="max-w-md w-full mx-auto p-4 rounded-md bg-black text-white shadow-md">
            <h5 className="font-bold text-xl mb-4 text-neutral-200">
                Donor Sign Up
            </h5>
            <div
                className="modal-body max-h-[500px] overflow-y-auto"
                style={{
                    scrollbarWidth: "none",
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Username */}
                    <LabelInputContainer>
                        <Label htmlFor="username" className="text-neutral-200">
                            Username
                        </Label>
                        <Input
                            id="username"
                            placeholder="Enter your username"
                            {...register("username")}
                            className="bg-black text-white border border-neutral-500"
                        />
                        {errors.username && (
                            <span className="text-red-500">
                                {errors.username.message}
                            </span>
                        )}
                    </LabelInputContainer>

                    {/* Email */}
                    <LabelInputContainer>
                        <Label htmlFor="email" className="text-neutral-200">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            placeholder="Enter your email"
                            {...register("email")}
                            className="bg-black text-white border border-neutral-500"
                        />
                        {errors.email && (
                            <span className="text-red-500">
                                {errors.email.message}
                            </span>
                        )}
                    </LabelInputContainer>

                    {/* Mobile Number */}
                    <LabelInputContainer>
                        <Label
                            htmlFor="mobileNumber"
                            className="text-neutral-200"
                        >
                            Mobile Number
                        </Label>
                        <Input
                            id="mobileNumber"
                            placeholder="Enter your mobile number"
                            {...register("mobileNumber")}
                            className="bg-black text-white border border-neutral-500"
                        />
                        {errors.mobileNumber && (
                            <span className="text-red-500">
                                {errors.mobileNumber.message}
                            </span>
                        )}
                    </LabelInputContainer>

                    {/* Password */}
                    <LabelInputContainer>
                        <Label htmlFor="password" className="text-neutral-200">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                            className="bg-black text-white border border-neutral-500"
                        />
                        {errors.password && (
                            <span className="text-red-500">
                                {errors.password.message}
                            </span>
                        )}
                    </LabelInputContainer>

                    {/* Address */}
                    <fieldset className="border p-3 mb-3 border-neutral-500">
                        <legend className="text-neutral-200">Address</legend>
                        {Object.keys(DonorFormSchema.shape.address.shape).map(
                            (field) => (
                                <LabelInputContainer key={field}>
                                    <Label
                                        htmlFor={field}
                                        className="text-neutral-200"
                                    >
                                        {field.charAt(0).toUpperCase() +
                                            field.slice(1)}
                                    </Label>
                                    <Input
                                        id={field}
                                        placeholder={`Enter ${field}`}
                                        {...register(
                                            `address.${
                                                field as keyof DonorFormSchemaType["address"]
                                            }`
                                        )}
                                        className="bg-black text-white border border-neutral-500"
                                    />
                                    {errors.address?.[
                                        field as keyof DonorFormSchemaType["address"]
                                    ] && (
                                        <span className="text-red-500">
                                            {
                                                errors.address[
                                                    field as keyof DonorFormSchemaType["address"]
                                                ]?.message
                                            }
                                        </span>
                                    )}
                                </LabelInputContainer>
                            )
                        )}
                    </fieldset>

                    {/* Buttons */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={toggleForm}
                            className="btn btn-outline-secondary bg-black text-white border-neutral-500 hover:bg-neutral-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
    </div>
);

export default DonorSignupForm;
