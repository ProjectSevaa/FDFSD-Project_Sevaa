import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label"; // Importing Label component
import { Input } from "@/components/ui/input"; // Importing Input component

interface DeliveryBoySignupFormProps {
  toggleForm: () => void;
}

const DeliveryBoySignupForm: React.FC<DeliveryBoySignupFormProps> = () => {
  const [deliveryBoyName, setDeliveryBoyName] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [drivingLicenseNo, setDrivingLicenseNo] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Delivery Boy Signup Submitted", {
      deliveryBoyName,
      password,
      mobileNumber,
      vehicleNo,
      drivingLicenseNo,
      longitude,
      latitude,
    });
    // Handle signup logic here
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLongitude(position.coords.longitude.toString());
        setLatitude(position.coords.latitude.toString());
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <style jsx>{`
        .modal-body {
          max-height: 400px;
          overflow-y: auto;
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }

        .modal-body::-webkit-scrollbar {
          display: none;  /* Chrome, Safari, and Opera */
        }
      `}</style>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black text-white">
        <div className="modal-header">
          <h5 className="font-bold text-xl text-neutral-200">Delivery Boy Sign Up</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            style={{ color: "#fff" }}
            onClick={() => {}}
          ></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="my-8">
            {/* Delivery Boy Name */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="deliveryBoyName" className="text-neutral-200">Name</Label>
              <Input
                id="deliveryBoyNameSignup"
                name="deliveryBoyName"
                type="text"
                value={deliveryBoyName}
                onChange={(e) => setDeliveryBoyName(e.target.value)}
                required
                placeholder="Enter your name"
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>

            {/* Password */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="passwordDel" className="text-neutral-200">Password</Label>
              <Input
                id="passwordDel"
                name="passwordDel"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>

            {/* Mobile Number */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="mobileNumber" className="text-neutral-200">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                pattern="[0-9]{10}"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                placeholder="Enter your mobile number"
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>

            {/* Vehicle Number */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="vehicleNo" className="text-neutral-200">Vehicle Number</Label>
              <Input
                id="vehicleNo"
                name="vehicleNo"
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                required
                placeholder="Enter your vehicle number"
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>

            {/* Driving License Number */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="drivingLicenseNo" className="text-neutral-200">Driving License Number</Label>
              <Input
                id="drivingLicenseNo"
                name="drivingLicenseNo"
                type="text"
                value={drivingLicenseNo}
                onChange={(e) => setDrivingLicenseNo(e.target.value)}
                required
                placeholder="Enter your driving license number"
                className="bg-black text-white border border-neutral-500"
              />
            </LabelInputContainer>

            {/* Coordinates Section */}
            <fieldset className="border p-3 mb-3 border-neutral-500">
              <legend className="text-neutral-200">Current Location (Coordinates)</legend>

              {/* Longitude */}
              <LabelInputContainer className="mb-4">
                <Label htmlFor="longitude" className="text-neutral-200">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  placeholder="Longitude"
                  className="bg-black text-white border border-neutral-500"
                />
              </LabelInputContainer>

              {/* Latitude */}
              <LabelInputContainer className="mb-4">
                <Label htmlFor="latitude" className="text-neutral-200">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  placeholder="Latitude"
                  className="bg-black text-white border border-neutral-500"
                />
              </LabelInputContainer>

              {/* Get Location Button */}
              <div className="mb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary text-white border border-neutral-500 bg-black rounded-md py-2 px-4 hover:bg-neutral-700"
                  onClick={getCurrentLocation}
                >
                  Get Current Location
                </button>
              </div>
            </fieldset>

            {/* Submit Button */}
            <div className="flex justify-between items-center space-x-4 mb-4">
              <button
                type="button"
                className="btn btn-outline-secondary text-white border border-neutral-500 bg-black rounded-md py-2 px-4 hover:bg-neutral-700"
                onClick={() => {}}
                style={{ width: "48%" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-white bg-blue-500 border border-transparent rounded-md py-2 px-4 hover:bg-blue-600"
                style={{ width: "48%" }}
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
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default DeliveryBoySignupForm;
