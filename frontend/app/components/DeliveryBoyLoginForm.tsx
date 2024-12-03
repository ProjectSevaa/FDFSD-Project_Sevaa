import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DeliveryBoyLoginFormProps {
  toggleForm: () => void;
}

const DeliveryBoyLoginForm: React.FC<DeliveryBoyLoginFormProps> = ({ toggleForm }) => {
  const [deliveryBoyName, setDeliveryBoyName] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission (login logic)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Delivery Boy Login Submitted", { deliveryBoyName, password });
    // Handle login logic here (e.g., API call)
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black text-white border-2 border-black">
      <div className="modal-header">
        <h5 className="font-bold text-xl text-neutral-200">Delivery Boy Login</h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          style={{ color: "#fff" }}
          onClick={toggleForm}
        ></button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit} className="my-8">
          {/* Delivery Boy Name input */}
          <div className="mb-4">
            <Label htmlFor="deliveryBoyName" className="block text-neutral-200 font-semibold mb-2">
              Delivery Boy Name:
            </Label>
            <Input
              type="text"
              id="deliveryBoyName"
              name="deliveryBoyName"
              value={deliveryBoyName}
              onChange={(e) => setDeliveryBoyName(e.target.value)}
              required
              placeholder="Enter your name"
              className="w-full p-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Password input */}
          <div className="mb-4">
            <Label htmlFor="passwordLogin" className="block text-neutral-200 font-semibold mb-2">
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
              className="btn btn-primary text-white bg-blue-600 rounded-md py-2 px-4 hover:bg-blue-700"
            >
              Login
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

export default DeliveryBoyLoginForm;
