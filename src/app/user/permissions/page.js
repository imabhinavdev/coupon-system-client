"use client";
import React, { useEffect, useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { backendApi, Permissions } from "@/data";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import AddPermissionModal from "@/components/modals/add-permission";
import EditPermissionModal from "@/components/modals/edit-permission";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

// Fetch permissions for displaying in the table
const fetchPermissions = async () => {
  try {
    const { data } = await axios.get(backendApi.permissions);
    return data.permissions;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch permissions");
  }
};

const PermissionsPage = () => {
  const queryClient = useQueryClient();
  const [addPermissionModalOpen, setAddPermissionModalOpen] = useState(false);
  const [editPermissionModalOpen, setEditPermissionModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const { userPermissions } = useContext(UserContext);
  const router = useRouter();

  // Check if the user has the required permission to view the page
  useEffect(() => {
    if (!userPermissions?.includes(Permissions.managePermissions)) {
      toast.error("You do not have permission to view this page.");
      router.push("/"); // Redirect to homepage or another page if permission is denied
    }
  }, [userPermissions, router]);

  // If the user doesn't have permission, return null to prevent rendering the page
  if (!userPermissions?.includes(Permissions.managePermissions)) {
    return null;
  }

  // Fetch permissions
  const {
    data: permissions,
    isLoading,
    error,
  } = useQuery({ queryKey: ["permissions"], queryFn: fetchPermissions });

  // Mutation for deleting a permission
  const deleteMutation = useMutation({
    mutationFn: async (permissionId) => {
      return await axios.delete(`${backendApi.permissions}/${permissionId}`);
    },
    onSuccess: () => {
      toast.success("Permission deleted successfully!");
      queryClient.invalidateQueries("permissions");
      setConfirmationModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete permission. Please try again.");
    },
  });

  const handleDeletePermission = (permissionId) => {
    deleteMutation.mutate(permissionId);
  };

  const openEditModal = (permissionId) => {
    setSelectedPermissionId(permissionId);
    setEditPermissionModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row w-full">
        <h2 className="text-2xl font-semibold w-full md:w-auto text-left text-gray-800">
          Permissions Management
        </h2>
        {userPermissions?.includes(Permissions.addPermissions) && (
          <button
            className="mt-4 md:mt-0 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ease-in-out duration-200 shadow"
            onClick={() => setAddPermissionModalOpen(true)}
          >
            Add Permission
          </button>
        )}
      </div>

      {/* Table for displaying permissions */}
      {isLoading ? (
        <p className="text-gray-600">Loading permissions...</p>
      ) : error ? (
        <p className="text-red-500">Error fetching permissions</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">
                Permission Name
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">
                Value
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((permission) => (
              <tr key={permission._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 border-b text-gray-800">
                  {permission.name}
                </td>
                <td className="px-6 py-4 border-b text-gray-800">
                  {permission.value}
                </td>
                <td className="px-6 py-4 border-b">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      permission.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {permission.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 border-b space-x-2">
                  {userPermissions?.includes(Permissions.editPermissions) && (
                    <button
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition ease-in-out duration-200 shadow"
                      onClick={() => openEditModal(permission._id)}
                    >
                      Edit
                    </button>
                  )}
                  {userPermissions?.includes(Permissions.deletePermissions) && (
                    <button
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition ease-in-out duration-200 shadow"
                      onClick={() => {
                        setSelectedPermissionId(permission._id);
                        setConfirmationModalOpen(true);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Permission Modal */}
      {addPermissionModalOpen && (
        <AddPermissionModal
          isOpen={addPermissionModalOpen}
          onClose={() => setAddPermissionModalOpen(false)}
        />
      )}

      {/* Edit Permission Modal */}
      {editPermissionModalOpen && (
        <EditPermissionModal
          isOpen={editPermissionModalOpen}
          onClose={() => setEditPermissionModalOpen(false)}
          permissionId={selectedPermissionId}
        />
      )}

      {/* Confirmation Modal for Delete */}
      {confirmationModalOpen && (
        <ConfirmationModal
          isOpen={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={() => handleDeletePermission(selectedPermissionId)}
          title="Delete Permission"
          message={`Are you sure you want to delete the permission "${
            permissions.find((perm) => perm._id === selectedPermissionId)?.name
          }"?`}
        />
      )}
    </div>
  );
};

export default PermissionsPage;
