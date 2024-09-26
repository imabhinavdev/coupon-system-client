"use client";
import { backendApi } from "@/data";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(backendApi.staff_users, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data.users);
          setUsers(data.users);
          setFilteredUsers(data.users); // Initialize filtered users with all users
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
    );
    setFilteredUsers(filtered);
  };

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Details</h1>
        <input
          type="text"
          placeholder="Search by name, email or phone"
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md p-2 w-64"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {user.name}
            </h2>
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Phone:</span> {user.phone}
            </p>
           
            <p className="text-gray-600">
              <span className="font-semibold">Active:</span>{" "}
              {user.is_active ? "Yes" : "No"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Staff:</span>{" "}
              {user.is_staff ? "Yes" : "No"}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Verified:</span>{" "}
              {user.is_verified ? "Yes" : "No"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
