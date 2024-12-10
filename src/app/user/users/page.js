"use client";
import { backendApi } from "@/data";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SiteLinks } from "@/data";
import { motion } from "framer-motion";
import { EditIcon, LoadingIcon } from "@/components/icons";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(backendApi.users, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
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
    <div className="container">
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">
                Sr No
              </th>
              <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">
                Name
              </th>
              <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">
                Email
              </th>
              <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">
                Mobile
              </th>
              <th className="px-4 py-2 border-b text-left text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user, index) => (
              <tr
                key={user?._id ?? `user-${index}`}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">
                  <Link
                    href={`${SiteLinks.manage_single_user.link}/${user?._id ?? "#"}`}
                  >
                    {user?.name ?? "N/A"}
                  </Link>
                </td>
                <td className="px-4 py-2 border-b">{user?.email ?? "N/A"}</td>
                <td className="px-4 py-2 border-b">{user?.phone ?? "N/A"}</td>
                <td className="px-4 py-2 border-b  ">
                  <Link
                    href={`${SiteLinks.manage_single_user.link}/${user?._id}`}
                  >
                    <EditIcon />
                  </Link>
                </td>
              </tr>
            )) ?? (
              <tr>
                <td colSpan="4" className="px-4 py-2 border-b text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
