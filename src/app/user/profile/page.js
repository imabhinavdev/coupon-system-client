"use client";
import React, { useContext } from "react";
import { UserContext } from "@/context/UserContext";

const Page = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="space-y-2">
        <p className="text-gray-700">
          <strong className="font-semibold">Name:</strong> {user.name}
        </p>
        <p className="text-gray-700">
          <strong className="font-semibold">Email:</strong> {user.email}
        </p>
        <p className="text-gray-700">
          <strong className="font-semibold">Role:</strong> {user.role.name}
        </p>
        <p className="text-gray-700">
          <strong className="font-semibold">Cash Due:</strong> ₹{user.cashDue} 
        </p>
      </div>
    </div>
  );
};

export default Page;
