"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddCouponCategoryModal from "@/components/add-coupon-category-modal";
import DropdownMenu from "@/components/context-drop-menu";
import { backendApi } from "@/data";

const AdminCouponCategoryDashboard = () => {
  const [couponCategory, setCouponCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCouponCategory = async () => {
      try {
        const response = await fetch(backendApi.coupon_category);
        const data = await response.json();
        if (response.ok) {
          setCouponCategory(data.coupon_category);
        } else {
          throw new Error(data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch coupon categories.");
      }
    };
    fetchCouponCategory();
  }, []);

  const filteredCategories = couponCategory.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    toast.error("Coupon category deleted successfully.");
  };

  const handleEdit = (id) => {
    toast.info("Edit coupon category functionality.");
  };

  const handleToggleActive = (id) => {
    toast.success("Coupon category activeness changed.");
  };

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-left mb-4 md:mb-0">
          Coupon Category Dashboard
        </h1>

        <div className="mb-4 md:mb-0 w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search coupon categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>

        <div className="w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add New Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {category.name}
              </h2>
              <DropdownMenu
                onDelete={() => handleDelete(category.id)}
                onEdit={() => handleEdit(category.id)}
                onToggleActive={() => handleToggleActive(category.id)}
              />
            </div>

            <p className="text-gray-600">
              <span className="font-semibold">Price:</span> {category.price} INR
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(category.created_at).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <span className={`font-semibold`}>Status:</span>{" "}
              <span
                className={`${
                  category.is_active ? "text-green-600" : "text-red-600"
                } font-semibold`}
              >
                {category.is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddCouponCategoryModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default AdminCouponCategoryDashboard;
