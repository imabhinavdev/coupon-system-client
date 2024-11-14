import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";
import { backendApi } from "@/data";

const AddPermissionModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addMutation = useMutation({
    mutationFn: async () => {
      await axios.post(backendApi.permissions, { name, value });
    },
    onSuccess: () => {
      toast.success("Permission added successfully!");
      queryClient.invalidateQueries("permissions");
      onClose();
    },
    onError: (err) => {
      toast.error("Failed to add permission.");
      setError(err.response?.data?.message || "Something went wrong");
    },
    onSettled: () => {
      setLoading(false); // reset loading state
    },
  });

  const handleAddPermission = () => {
    if (!name || !value) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    addMutation.mutate();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-96 mx-auto">
          <h3 className="text-xl font-semibold mb-4">Add Permission</h3>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Permission Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Permission Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          />
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPermission}
              disabled={loading}
              className={`px-4 py-2 rounded-md ${loading ? "bg-gray-400" : "bg-blue-600 text-white"} hover:bg-blue-700`}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddPermissionModal;
