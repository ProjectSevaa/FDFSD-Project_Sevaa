import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Utility for conditional class names
import { toast } from "@/hooks/use-toast"; // Adjust import for your toast library

interface DonorSignupFormProps {
  toggleForm: () => void;
}

const DonorSignupForm: React.FC<DonorSignupFormProps> = ({ toggleForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState({
    doorNo: "",
    street: "",
    landmark: "",
    townCity: "",
    state: "",
    pincode: "",
  });

  // Submit handler
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = {
      username,
      email,
      mobileNumber,
      password,
      address,
    };

    try {
      const response = await fetch("http://localhost:9500/auth/donorSignup", {
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
  }

  return (
    <>
      <style jsx>{`
        .modal-body {
          max-height: 400px;
          overflow-y: auto;
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }

        .modal-body::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black text-white">
        <div className="modal-header">
          <h5 className="font-bold text-xl text-neutral-200">Donor Sign Up</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            style={{ color: "#fff" }}
            onClick={toggleForm}
          ></button>
        </div>
        <div className="modal-body">
          <form onSubmit={onSubmit} className="my-8">
            {/* Username and Email Section */}
            <LabelInputContainer>
              <Label htmlFor="username" className="text-neutral-200">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="email" className="text-neutral-200">
                Email Address
              </Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                pattern=".+@food\.in$"
                title="Email must end with @food.in"
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="mobileNumber" className="text-neutral-200">
                Mobile Number
              </Label>
              <Input
                id="mobileNumber"
                placeholder="Enter your mobile number"
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>

            {/* Password Section */}
            <LabelInputContainer>
              <Label htmlFor="password" className="text-neutral-200">
                Password
              </Label>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>

            {/* Address Section */}
            <fieldset className="border p-3 mb-3 border-neutral-500">
              <legend className="text-neutral-200">Address</legend>
              <div className="mb-3">
                <Label htmlFor="doorNo" className="text-neutral-200">
                  Door No
                </Label>
                <Input
                  id="doorNo"
                  placeholder="Enter door number"
                  type="text"
                  value={address.doorNo}
                  onChange={(e) =>
                    setAddress({ ...address, doorNo: e.target.value })
                  }
                  required
                  className="bg-black text-white border border-neutral-500"
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="street" className="text-neutral-200">
                  Street
                </Label>
                <Input
                  id="street"
                  placeholder="Enter street name"
                  type="text"
                  value={address.street}
                  onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                  }
                  required
                  className="bg-black text-white border border-neutral-500"
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="landmark" className="text-neutral-200">
                  Landmark (Optional)
                </Label>
                <Input
                  id="landmark"
                  placeholder="Enter landmark (Optional)"
                  type="text"
                  value={address.landmark}
                  onChange={(e) =>
                    setAddress({ ...address, landmark: e.target.value })
                  }
                  className="bg-black text-white border border-neutral-500"
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="townCity" className="text-neutral-200">
                  Town/City
                </Label>
                <Input
                  id="townCity"
                  placeholder="Enter town or city"
                  type="text"
                  value={address.townCity}
                  onChange={(e) =>
                    setAddress({ ...address, townCity: e.target.value })
                  }
                  required
                  className="bg-black text-white border border-neutral-500"
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="state" className="text-neutral-200">
                  State
                </Label>
                <Input
                  id="state"
                  placeholder="Enter state"
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  required
                  className="bg-black text-white border border-neutral-500"
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="pincode" className="text-neutral-200">
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  placeholder="Enter pincode"
                  type="text"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({ ...address, pincode: e.target.value })
                  }
                  required
                  className="bg-black text-white border border-neutral-500"
                />
              </div>
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
    </>
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
