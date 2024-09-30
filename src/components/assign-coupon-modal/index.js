import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { backendApi } from "@/data";

const AssignCouponModal = ({ userId, isOpen, onClose }) => {
  if (!isOpen) return null;
  const [couponCategories, setCouponCategories] = useState([]);

  const couponCategoryIdRef = useRef(null);
  const noOfPersonRef = useRef(null);
  const fetchCouponCategories = async () => {
    try {
      const response = await fetch(`${backendApi.active_coupon_category}`);
      const data = await response.json();
      if (response.ok) {
        setCouponCategories(data.coupon_category);
      }
    } catch (error) {
      console.error("Error fetching coupon categories:", error);
    }
  };

  useEffect(() => {
    fetchCouponCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noOfPerson = noOfPersonRef.current.value;
    const couponCategoryId = couponCategoryIdRef.current.value;

    console.log(userId, noOfPerson, couponCategoryId);
    try {
      const response = await fetch(`${backendApi.assign_coupon}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           userId,
          noOfPerson,
          couponCategoryId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Coupon assigned successfully");
        onClose();
      } else {
        toast.error(data.detail);
      }
    } catch (error) {
      console.error("Error assigning coupon:", error);
      toast.error("Error assigning coupon");
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed p-2 md:p-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Assign Coupon</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">No of Person</label>
            <input
              type="number"
              name="noOfPerson"
              min={1}
              ref={noOfPersonRef}
              required
              placeholder="6"
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Staff</label>
            <select
              name="couponCategoryId"
              required
              ref={couponCategoryIdRef}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            >
              {couponCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 ">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 w-full text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 w-full text-white px-4 py-2 rounded-md"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignCouponModal;
