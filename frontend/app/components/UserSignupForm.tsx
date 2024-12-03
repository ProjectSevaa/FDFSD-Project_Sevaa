import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label"; // Importing Label component
import { Input } from "@/components/ui/input"; // Importing Input component
import { toast } from "@/hooks/use-toast"; // Assuming you have a toast component
import { cn } from "@/lib/utils"; // Utility for conditional class names

// Zod schema for form validation
const FormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
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

type FormSchemaType = z.infer<typeof FormSchema>;

interface UserSignupFormProps {
  toggleForm: () => void;
}

const UserSignupForm: React.FC<UserSignupFormProps> = ({ toggleForm }) => {
  const form = useForm<FormSchemaType>({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const response = await fetch("http://localhost:9500/auth/userSignup", {
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
        // Additional UI logic
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

  return (
    <div className="max-w-md w-full mx-auto p-4 rounded-md bg-black text-white shadow-md">
      <h5 className="font-bold text-xl mb-4 text-neutral-200">User Sign Up</h5>
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
            <span className="text-red-500">{errors.username.message}</span>
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
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </LabelInputContainer>

        {/* Mobile Number */}
        <LabelInputContainer>
          <Label htmlFor="mobileNumber" className="text-neutral-200">
            Mobile Number
          </Label>
          <Input
            id="mobileNumber"
            placeholder="Enter your mobile number"
            {...register("mobileNumber")}
            className="bg-black text-white border border-neutral-500"
          />
          {errors.mobileNumber && (
            <span className="text-red-500">{errors.mobileNumber.message}</span>
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
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </LabelInputContainer>

        {/* Address */}
        <fieldset className="border p-3 mb-3 border-neutral-500">
          <legend className="text-neutral-200">Address</legend>
          {Object.keys(FormSchema.shape.address.shape).map((field) => (
            <LabelInputContainer key={field}>
              <Label htmlFor={field} className="text-neutral-200">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                placeholder={`Enter ${field}`}
                {...register(
                  `address.${field as keyof FormSchemaType["address"]}`
                )}
                className="bg-black text-white border border-neutral-500"
              />
              {errors.address?.[field as keyof FormSchemaType["address"]] && (
                <span className="text-red-500">
                  {
                    errors.address[field as keyof FormSchemaType["address"]]
                      ?.message
                  }
                </span>
              )}
            </LabelInputContainer>
          ))}
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

export default UserSignupForm;
