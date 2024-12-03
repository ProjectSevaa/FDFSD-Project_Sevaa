"use client";

import React, { useState } from "react";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import UserLoginForm from "./UserLoginForm";
import DonorLoginForm from "./DonorLoginForm";
import DeliveryBoyLoginForm from "./DeliveryBoyLoginForm";
import UserSignupForm from "./UserSignupForm";
import DonorSignupForm from "./DonorSignupForm";
import DeliveryBoySignupForm from "./DeliveryBoySignupForm";

interface DrawerDemoProps {
  drawerType: string;
}

export const DrawerDemo: React.FC<DrawerDemoProps> = ({ drawerType }) => {
  const [open, setOpen] = useState(true);
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup forms

  const toggleForm = () => {
    setIsSignup((prev) => !prev); // Toggle between login and signup forms
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="bg-opacity-50 bg-black backdrop-blur-lg text-white shadow-xl rounded-lg p-4">
        <h2 id="drawer-title" className="text-lg font-semibold mb-4">
          {isSignup
            ? drawerType === "user"
              ? ""
              : drawerType === "donor"
              ? ""
              : ""
            : drawerType === "user"
            ? ""
            : drawerType === "donor"
            ? ""
            : ""}
        </h2>

        {isSignup ? (
          drawerType === "user" ? (
            <UserSignupForm toggleForm={toggleForm} />
          ) : drawerType === "donor" ? (
            <DonorSignupForm toggleForm={toggleForm} />
          ) : (
            <DeliveryBoySignupForm toggleForm={toggleForm} />
          )
        ) : drawerType === "user" ? (
          <UserLoginForm toggleForm={toggleForm} />
        ) : drawerType === "donor" ? (
          <DonorLoginForm toggleForm={toggleForm} />
        ) : (
          <DeliveryBoyLoginForm toggleForm={toggleForm} />
        )}

        <DrawerClose asChild>
          <button
            className="absolute top-4 right-4 text-white bg-transparent"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};
