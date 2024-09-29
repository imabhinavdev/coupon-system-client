import React, { useState } from "react";
import { toast } from "react-toastify";
import { backendApi } from "@/data";

const EditUserModal = ({ isOpen, onClose, userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    enrollment: userData.enrollment,
    isVerified: userData.isVerified,
    isAdmin: userData.isAdmin,
    isStaff: userData.isStaff,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${backendApi.update_user}/${userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        onUpdate(); // Refresh the user details
        toast.success("User details updated successfully!");
        onClose();
      } else {
        toast.error("Failed to update user details");
      }
    } catch (error) {
      toast.error("Error updating user details");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed p-2 md:p-0 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit User Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Enrollment</label>
            <input
              type="text"
              name="enrollment"
              value={formData.enrollment}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Verified</label>
            <select
              name="isVerified"
              value={formData.isVerified}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Staff</label>
            <select
              name="isStaff"
              value={formData.isStaff}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Admin</label>
            <select
              name="isAdmin"
              value={formData.isAdmin}
              onChange={handleChange}
              className="mt-1 block p-2 w-full border border-gray-300 rounded-md"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
