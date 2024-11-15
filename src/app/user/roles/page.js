"use client";
import AddRoleModals from "@/components/modals/add-role";
import React, { useEffect, useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { backendApi, Permissions } from "@/data";
import ConfirmationModal from "@/components/modals/confirmation-modal";
import EditRoleModal from "@/components/modals/edit-role";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";

// Fetch roles for displaying in the table
const fetchRoles = async () => {
  try {
    const { data } = await axios.get(backendApi.roles);
    return data.roles;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch roles");
  }
};

const RolesPage = () => {
  const queryClient = useQueryClient();
  const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const { userPermissions } = useContext(UserContext);

  const router = useRouter();

  // Check if the user has sufficient permissions
  const hasPermissionToManageRoles = userPermissions?.includes(
    Permissions.manageRoles
  );

  useEffect(() => {
    if (!hasPermissionToManageRoles) {
      toast.error("You do not have permission to view this page.");
      router.push("/");
    }
  }, [hasPermissionToManageRoles, router]);

  // Fetch roles
  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    enabled: hasPermissionToManageRoles,
  });

  // Mutation for deleting a role
  const deleteMutation = useMutation({
    mutationFn: async (roleId) => {
      return await axios.delete(`${backendApi.roles}/${roleId}`);
    },
    onSuccess: () => {
      toast.success("Role deleted successfully!");
      queryClient.invalidateQueries("roles");
      setConfirmationModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete role. Please try again.");
    },
  });

  const handleDeleteRole = (roleId) => {
    deleteMutation.mutate(roleId);
  };

  const openEditModal = (roleId) => {
    setSelectedRoleId(roleId);
    setEditRoleModalOpen(true);
  };

  // Early return if user doesn't have permission
  if (!hasPermissionToManageRoles) {
    return null; // Optionally, you can render a message or redirect here
  }

  return (
    <div className="p-6 lg:p-8 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row w-full">
        <h2 className="text-3xl font-semibold text-gray-800 text-left w-full md:w-auto mb-4 md:mb-0">
          Roles Management
        </h2>
        {userPermissions?.includes(Permissions.addRoles) && (
          <button
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition shadow-sm"
            onClick={() => setAddRoleModalOpen(true)}
          >
            + Add Role
          </button>
        )}
      </div>

      {/* Table for displaying roles */}
      {isLoading ? (
        <p className="text-center text-gray-500 py-4">Loading roles...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">Error fetching roles</p>
      ) : (
        <table className="w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-6 py-3 border-b font-semibold text-left">
                Role Name
              </th>
              <th className="px-6 py-3 border-b font-semibold text-left">
                Status
              </th>
              
              <th className="px-6 py-3 border-b font-semibold text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 border-b text-gray-800">
                  {role.name}
                </td>
                <td className="px-6 py-4 border-b">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      role.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {role.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                {/* <td className="px-6 py-4 border-b text-gray-600">
                  {role.permissions.map((perm) => perm.name).join(", ")}
                </td> */}
                <td className="px-6 py-4 border-b flex gap-1">
                  {userPermissions?.includes(Permissions.editRoles) && (
                    <button
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      onClick={() => openEditModal(role._id)}
                    >
                      Edit
                    </button>
                  )}
                  {userPermissions?.includes(Permissions.deleteRoles) && (
                    <>
                      {role._id !== "6704c519872420e9113263ab" &&
                        role._id !== "673624f19606f3fc2cd6e450" && (
                          <button
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            onClick={() => {
                              setSelectedRoleId(role._id);
                              setConfirmationModalOpen(true);
                            }}
                          >
                            Delete
                          </button>
                        )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Role Modal */}
      {addRoleModalOpen && (
        <AddRoleModals
          isOpen={addRoleModalOpen}
          onClose={() => setAddRoleModalOpen(false)}
        />
      )}

      {/* Edit Role Modal */}
      {editRoleModalOpen && (
        <EditRoleModal
          isOpen={editRoleModalOpen}
          onClose={() => setEditRoleModalOpen(false)}
          roleId={selectedRoleId}
        />
      )}

      {/* Confirmation Modal for Delete */}
      {confirmationModalOpen && (
        <ConfirmationModal
          isOpen={confirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={() => handleDeleteRole(selectedRoleId)}
          title="Delete Role"
          message={`Are you sure you want to delete the role "${roles.find((role) => role._id === selectedRoleId)?.name}"?`}
        />
      )}
    </div>
  );
};

export default RolesPage;
