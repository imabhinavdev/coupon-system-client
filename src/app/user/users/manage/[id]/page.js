"use client";
import React, { useEffect, useState } from "react";
import { backendApi } from "@/data";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import DropdownMenu from "@/components/context-drop-menu";
import EditUserModal from "@/components/edit-user-modal";
import { formatDate } from "@/utils/FormatDate";
import { formatTime } from "@/utils/FormatTime";
import AssignCouponModal from "@/components/assign-coupon-modal";
import { LoadingIcon } from "@/components/icons";

const ManageUserData = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignCouponModalOpen, setIsAssignCouponModalOpen] = useState(false);

  // Fetch user details
  const fetchDetails = async () => {
    try {
      const response = await fetch(`${backendApi.all_details_of_user}/${id}`);
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        toast.error("Error fetching user details");
      }
    } catch (error) {
      toast.error("Error fetching user details");
    }
  };

  // Delete user logic
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${backendApi.delete_user}${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("User deleted successfully");
        
        // Optionally, redirect or refresh the page if necessary
      } else {
        toast.error("Error deleting user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeAssignCouponModal = () => {
    setIsAssignCouponModalOpen(false);
  };

  const refreshUserData = () => {
    fetchDetails();
  };

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingIcon className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="">
      {/* User Info Card */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 flex md:flex-row justify-between items-center">
          User Information
          <span>
            <DropdownMenu
              onEdit={openEditModal}
              onDelete={handleDeleteUser} // Pass delete handler
              showAssignCoupon
              onAssign={() => {
                setIsAssignCouponModalOpen(true);
              }}
            />
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <p>
              <strong>Name:</strong> {data?.user?.name ?? "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {data?.user?.email ?? "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Phone:</strong> {data?.user?.phone ?? "N/A"}
            </p>
            <p>
              <strong>Enrollment:</strong> {data?.user?.enrollment ?? "N/A"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <p>
              <strong>Account Created:</strong>{" "}
              {formatDate(data?.user?.createdAt ?? null)}
            </p>
            <p>
              <strong>Is Verified:</strong>{" "}
              {data?.user?.isVerified ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p>
              <strong>Role:</strong>
              <span className="capitalize"> {data?.user?.role ?? "N/A"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        userData={data?.user ?? {}}
        onUpdate={refreshUserData}
      />

      <AssignCouponModal
        isOpen={isAssignCouponModalOpen}
        onClose={closeAssignCouponModal}
        userId={id ?? null}
      />

      {/* Tabs for Orders and Transactions */}
      <div className="mb-4">
        <div className="flex justify-center mb-2">
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ml-2 ${
              activeTab === "transactions"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
        </div>
        <div className="bg-white shadow-md rounded-b-lg p-4 md:p-6">
          {activeTab === "orders" ? (
            // Orders Table
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                User Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border">Order ID</th>
                      <th className="p-2 border">Coupon Category</th>
                      <th className="p-2 border">Day</th>
                      <th className="p-2 border">Used</th>
                      <th className="p-2 border">Scanned By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.orders?.map((order, index) => (
                      <tr key={index}>
                        <td className="p-2 border text-center">
                          {order?._id ?? "N/A"}
                        </td>
                        <td className="p-2 border text-center">
                          {order?.couponCategoryId?.name ?? "N/A"}
                        </td>
                        <td className="p-2 border text-center">
                          {formatDate(order?.createdAt ?? null)}
                        </td>
                        <td
                          className={`p-2 border text-center ${
                            order?.isUsed ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {order?.isUsed ? "Yes" : "No"}
                        </td>
                        <td className="p-2 border text-center">
                          {order?.scannedBy?.name ?? "-"}
                        </td>
                      </tr>
                    )) ?? (
                      <tr>
                        <td colSpan="5">No orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Transactions Table
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">
                User Transactions
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border">Transaction ID</th>
                      <th className="p-2 border">Coupon Category</th>
                      <th className="p-2 border">Day</th>
                      <th className="p-2 border">Time</th>
                      <th className="p-2 border">Amount</th>
                      <th className="p-2 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.transactions?.map((transaction, index) => (
                      <tr key={index}>
                        <td className="p-2 border text-center">
                          {transaction?._id ?? "N/A"}
                        </td>
                        <td className="p-2 border text-center">
                          {transaction?.couponCategoryId?.name ?? "N/A"}
                        </td>
                        <td className="p-2 border text-center">
                          {formatDate(transaction?.createdAt ?? null)}
                        </td>
                        <td className="p-2 border text-center">
                          {formatTime(transaction?.createdAt ?? null)}
                        </td>
                        <td className="p-2 border text-center">
                          {transaction?.amount ?? "N/A"}
                        </td>
                        <td className="p-2 border text-center">
                          {transaction?.status}
                        </td>
                      </tr>
                    )) ?? (
                      <tr>
                        <td colSpan="6">No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUserData;
