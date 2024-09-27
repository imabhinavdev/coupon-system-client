"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { CrossIcon } from "@/components/icons";
import { backendApi } from "@/data";
const AddCouponCategoryModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(backendApi.coupon_category, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, price, is_active: isActive }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Coupon category added successfully.");
        onClose(); // Close the modal on success
      } else {
        throw new Error(data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add coupon category.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Coupon Category</h2>
          <button onClick={onClose}>
            <CrossIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price (INR)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="mr-2"
              />
              Active
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCouponCategoryModal;
