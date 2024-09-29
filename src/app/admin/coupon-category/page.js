"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddCouponCategoryModal from "@/components/add-coupon-category-modal";
import EditCouponCategoryModal from "@/components/edit-coupon-category-modal";
import DropdownMenu from "@/components/context-drop-menu";
import { backendApi } from "@/data";
import { formatDate } from "@/utils/FormatDate";

const AdminCouponCategoryDashboard = () => {
  const [couponCategory, setCouponCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);

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
  }, [isEditModalOpen,isModalOpen]);

  const filteredCategories = couponCategory.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${backendApi.coupon_category}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCouponCategory((prev) =>
          prev.filter((category) => category.id !== id)
        ); // Remove deleted category from state
        toast.error("Coupon category deleted successfully.");
      } else {
        throw new Error("Failed to delete coupon category.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete coupon category.");
    }
  };

  const handleEdit = async (category) => {
    setSelectedCategory(category); // Set the selected category for editing
    setIsEditModalOpen(true); // Open the edit modal
  };

  const updateCategory = async (updatedCategory) => {
    try {
      const response = await fetch(
        `${backendApi.edit_coupon_category}/${updatedCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        }
      );
      if (response.ok) {
        const updatedCategories = couponCategory.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        );
        setCouponCategory(updatedCategories); // Update state with the edited category
        toast.success("Coupon category updated successfully.");
      } else {
        throw new Error("Failed to update coupon category.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update coupon category.");
    } finally {
      setIsEditModalOpen(false); // Close the modal after editing
    }
  };

  const handleToggleActive = async (id) => {
    // Functionality to toggle active status (implement as needed)
    toast.success("Coupon category activeness changed.");
  };

  return (
    <div className="">
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
                onDelete={() => handleDelete(category._id)}
                category={category.name}
                onEdit={() => handleEdit(category)} // Pass category for editing
                onToggleActive={() => handleToggleActive(category.id)}
              />
            </div>

            <p className="text-gray-600">
              <span className="font-semibold">Price:</span> ₹ {category.price}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Created At:</span>{" "}
              {formatDate(category.createdAt)}
            </p>
            <p className="text-gray-600">
              <span className={`font-semibold`}>Status:</span>{" "}
              <span
                className={`${
                  category.isActive ? "text-green-600" : "text-red-600"
                } font-semibold`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        ))}
      </div>
      {filteredCategories.length === 0 && (
        <div className="text-center text-gray-600 w-full h-full">
          No coupon categories found.
        </div>
      )}

      {isModalOpen && (
        <AddCouponCategoryModal onClose={() => setIsModalOpen(false)} />
      )}

      {isEditModalOpen && selectedCategory && (
        <EditCouponCategoryModal
          onClose={() => setIsEditModalOpen(false)}
          category={selectedCategory}
          onUpdate={updateCategory}
        />
      )}
    </div>
  );
};

export default AdminCouponCategoryDashboard;
