import React, { useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import { backendApi } from "@/data";
import axios from "axios";
import Select from "react-select";

// Fetch permissions for select options
const fetchPermissions = async () => {
  try {
    const { data } = await axios.get(backendApi.permissions);
    console.log(data.permissions);
    return data.permissions;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch permissions");
  }
};

// Fetch existing role details
const fetchRoleDetails = async (roleId) => {
  try {
    const { data } = await axios.get(`${backendApi.roles}/${roleId}`);
    return data.role;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch role details");
  }
};

const EditRoleModal = ({ isOpen, onClose, roleId }) => {
  const [roleName, setRoleName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Fetch available permissions for the select dropdown
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch the current role details when the modal opens
  const { data: role, isLoading: roleLoading } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => fetchRoleDetails(roleId),
    enabled: !!roleId && isOpen,
  });

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setIsActive(role.isActive);
      setSelectedPermissions(
        role.permissions.map((perm) => ({
          value: perm._id,
          label: perm.name,
        }))
      );
    }
  }, [role]);

  // Mutation to update a role
  const updateMutation = useMutation({
    mutationFn: async (updatedRole) => {
      return await axios.put(`${backendApi.roles}/${roleId}`, updatedRole);
    },
    onMutate: () => {
      toast.loading("Updating role...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Role updated successfully!");
      onClose();
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update role. Please try again.");
    },
  });

  // Function to handle the role update
  const handleUpdateRole = () => {
    const updatedRole = {
      name: roleName,
      isActive,
      permissions: selectedPermissions.map((perm) => perm.value),
    };
    updateMutation.mutate(updatedRole);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Edit Role</h2>

        {roleLoading || permissionsLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Role Name Input */}
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Role Name
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role name"
            />

            {/* Active Toggle */}
            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-gray-700 text-sm">Is Active</label>
            </div>

            {/* Permissions Select */}
            <label className="block text-gray-700 text-sm font-semibold mt-4">
              Permissions
            </label>
            <Select
              isMulti
              options={permissions?.map((permission) => ({
                value: permission._id,
                label: permission.name,
              }))}
              value={selectedPermissions}
              onChange={setSelectedPermissions}
              isLoading={permissionsLoading}
              placeholder="Select permissions"
              className="w-full"
              classNamePrefix="select"
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={handleUpdateRole}
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditRoleModal;
