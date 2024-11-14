import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import { backendApi, Permissions } from "@/data";
import axios from "axios";
import Select from "react-select";
import { useQueryClient } from "@tanstack/react-query";
// Fetch permissions for select options
const fetchPermissions = async () => {
  try {
    const { data } = await axios.get(backendApi.permissions);
    return data.permissions;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch permissions");
  }
};

const AddRoleModals = ({ isOpen, onClose }) => {
  const { userPermissions } = useContext(UserContext);
  const [roleName, setRoleName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const queryClient = useQueryClient();

  // Fetch available permissions
  const { data: permissions, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
    staleTime: 1000 * 60 * 5,
  });

  // Mutation to add a role
  const mutation = useMutation({
    mutationFn: async (newRole) => {
      return await axios.post(backendApi.roles, newRole);
    },
    onMutate: () => {
      toast.loading("Adding role...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Role added successfully!");
      queryClient.invalidateQueries("roles");
      onClose();
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to add role. Please try again.");
    },
  });

  const handleAddRole = () => {
    const newRole = {
      name: roleName,
      isActive,
      permissions: selectedPermissions.map((perm) => perm.value), // Store as array of `_id`s
    };
    mutation.mutate(newRole);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Add Role</h2>

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
            value: permission._id, // Use `_id` for each permission
            label: permission.name,
          }))}
          value={selectedPermissions}
          onChange={setSelectedPermissions}
          isLoading={isLoading}
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
            onClick={handleAddRole}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Adding..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModals;
