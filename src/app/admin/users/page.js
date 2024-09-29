"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import DashboardCard from "@/components/dashboard-card";
import { SiteLinks, backendApi } from "@/data";
import { debounce } from "lodash";
import { ThreeDotsIcon } from "@/components/icons";
import Link from "next/link";

const ManageUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [searchResults, setSearchResults] = useState([]); // State for storing the search results
  const [isSearching, setIsSearching] = useState(false); // Loader state for searching
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false); // Track if search results are open
  const searchBoxRef = useRef(null); // Ref for the search results container

  const userCardsData = [
    {
      title: "Manage Student Users",
      description: "View, edit, and manage all student users in the system.",
      buttonLabel: "Manage Students",
      buttonColor: "bg-blue-500",
      link: SiteLinks.admin_all_users.link,
    },
    {
      title: "Manage Staff Users",
      description: "View, edit, and manage all staff users in the system.",
      buttonLabel: "Manage Staff",
      buttonColor: "bg-green-500",
      link: SiteLinks.admin_staff_users.link,
    },
    {
      title: "Manage Admin Users",
      description: "View, edit, and manage all admin users in the system.",
      buttonLabel: "Manage Admins",
      buttonColor: "bg-red-500",
      link: SiteLinks.admin_admin_users.link,
    },
  ];

  // Debounced function to search users
  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      try {
        setIsSearching(true); // Show loading
        const response = await fetch(`${backendApi.search_users}${query}`);
        const data = await response.json();
        if (response.ok) {
          console.log(data.users);
          setSearchResults(data.users);
          setIsSearchBoxOpen(true); // Show search results
        } else {
          throw new Error("Error in fetching results");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false); // Stop loading
      }
    }, 500), // 500ms delay for debouncing
    []
  );

  // Update search term and trigger debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      fetchSearchResults(value); // Fetch results after debouncing
    } else {
      setSearchResults([]); // Clear results if search box is empty
      setIsSearchBoxOpen(false); // Hide search results
    }
  };

  // Close search results on click outside
  const handleClickOutside = (event) => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
      setIsSearchBoxOpen(false); // Hide search results
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full md:w-auto" ref={searchBoxRef}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search users..."
              className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
            />
            {isSearching && (
              <div className="absolute right-2 top-2">
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              </div>
            )}
            {/* Search Results */}
            {isSearchBoxOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 w-full overflow-y-auto z-20 mt-2">
                {searchResults.map((user, index) => (
                  <Link
                    key={index}
                    href={`${SiteLinks.manage_single_user.link}/${user._id}`}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer transition ease-in-out duration-200"
                    // Handle user selection
                  >
                    <div>
                      <p className="font-medium text-blue-500">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {/* <span className="text-gray-500">
                    <ThreeDotsIcon />
                    </span> */}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Add User Button */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Add User
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCardsData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            description={card.description}
            buttonLabel={card.buttonLabel}
            buttonColor={card.buttonColor}
            link={card.link}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageUsersPage;
