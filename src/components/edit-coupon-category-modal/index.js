import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { backendApi } from "@/data";

const EditCouponCategoryModal = ({ onClose, category }) => {
  const [name, setName] = useState(category.name);
  const [price, setPrice] = useState(category.price);
  const [isActive, setIsActive] = useState(category.isActive);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${backendApi.edit_coupon_category}${category._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, price, isActive: isActive }),
        },
      );

      if (response.ok) {
        toast.success("Coupon category updated successfully.");
        onClose(); // Close the modal
      } else {
        throw new Error("Failed to update coupon category.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update coupon category.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Coupon Category</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4 cursor-pointer">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="mr-2"
              />
              Active
            </label>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCouponCategoryModal;
