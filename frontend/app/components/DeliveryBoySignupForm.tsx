import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DeliveryBoySignupForm: React.FC = () => {
  const [deliveryBoyName, setDeliveryBoyName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [drivingLicenseNo, setDrivingLicenseNo] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !deliveryBoyName ||
      !mobileNumber ||
      !password ||
      !vehicleNo ||
      !drivingLicenseNo
    ) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!/^[0-9]{10}$/.test(mobileNumber)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Mobile number must be 10 digits.",
        variant: "destructive",
      });
      return;
    }

    const signupData = {
      deliveryBoyName,
      mobileNumber,
      password, // Ensure password is part of the request payload
      vehicleNo,
      drivingLicenseNo,
      currentLocation: {
        type: "Point",
        coordinates: [
          parseFloat(longitude) || 0,
          parseFloat(latitude) || 0,
        ],
      },
    };

    try {
      const response = await fetch("http://localhost:9500/deliveryboy/createDeliveryBoy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Signup Successful",
          description: "Your account has been created successfully.",
        });
        setDeliveryBoyName("");
        setMobileNumber("");
        setPassword("");
        setVehicleNo("");
        setDrivingLicenseNo("");
        setLongitude("");
        setLatitude("");
      } else {
        const errorData = await response.json();
        toast({
          title: "Signup Failed",
          description:
            errorData.message || "An error occurred. Please try again.",
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude.toString());
          setLatitude(position.coords.latitude.toString());
          toast({
            title: "Location Retrieved",
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
    <div className="max-w-md mx-auto p-4 bg-black text-white rounded-md">
      <h2 className="text-xl font-bold mb-4">Delivery Boy Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Delivery Boy Name"
          value={deliveryBoyName}
          onChange={(e) => setDeliveryBoyName(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
        />
        <Input
          placeholder="Vehicle Number"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value)}
          required
        />
        <Input
          placeholder="Driving License Number"
          value={drivingLicenseNo}
          onChange={(e) => setDrivingLicenseNo(e.target.value)}
          required
        />
        <div className="flex space-x-2">
          <Input
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            disabled
          />
          <Input
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            disabled
          />
        </div>
        <Button type="button" onClick={getCurrentLocation}>
          Get Current Location
        </Button>
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
};

export default DeliveryBoySignupForm;
