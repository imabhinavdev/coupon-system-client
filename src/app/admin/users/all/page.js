"use client";
import { backendApi } from "@/data";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SiteLinks } from "@/data";
import { motion } from "framer-motion";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(backendApi.other_users, {
          method: "GET",
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
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingIcon className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="container ">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">All Details</h1>
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md p-2 w-full md:w-64"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredUsers.map((user) => (
          <Link
            key={user._id}
            href={`${SiteLinks.manage_single_user.link}/${user._id}`}
          >
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
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
                <span className="font-semibold">Enrollment:</span>{" "}
                {user.Enrollment}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Active:</span>{" "}
                {user.is_active ? "Yes" : "No"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Verified:</span>{" "}
                {user.is_verified ? "Yes" : "No"}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
