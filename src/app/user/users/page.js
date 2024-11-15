// "use client";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import DashboardCard from "@/components/dashboard-card";
// import { SiteLinks, backendApi } from "@/data";
// import { debounce } from "lodash";
// import { ThreeDotsIcon } from "@/components/icons";
// import Link from "next/link";

// const ManageUsersPage = () => {
//   const [searchTerm, setSearchTerm] = useState(""); // State for the search term
//   const [searchResults, setSearchResults] = useState([]); // State for storing the search results
//   const [isSearching, setIsSearching] = useState(false); // Loader state for searching
//   const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false); // Track if search results are open
//   const searchBoxRef = useRef(null); // Ref for the search results container

//   const userCardsData = [
//     {
//       title: "Manage Student/Faculty Users",
//       description:
//         "View, edit, and manage all student/faculty users in the system.",
//       buttonLabel: "Manage Users",
//       buttonColor: "bg-blue-500",
//       link: SiteLinks.admin_all_users.link,
//     },
//     {
//       title: "Manage Staff Users",
//       description: "View, edit, and manage all staff users in the system.",
//       buttonLabel: "Manage Staff",
//       buttonColor: "bg-green-500",
//       link: SiteLinks.admin_staff_users.link,
//     },
//     {
//       title: "Manage Admin Users",
//       description: "View, edit, and manage all admin users in the system.",
//       buttonLabel: "Manage Admins",
//       buttonColor: "bg-red-500",
//       link: SiteLinks.admin_admin_users.link,
//     },
//   ];

//   // Debounced function to search users
//   const fetchSearchResults = useCallback(
//     debounce(async (query) => {
//       try {
//         setIsSearching(true); // Show loading
//         const response = await fetch(`${backendApi.search_users}${query}`);
//         const data = await response.json();
//         if (response.ok) {
//           setSearchResults(data.users);
//           setIsSearchBoxOpen(true); // Show search results
//         } else {
//           throw new Error("Error in fetching results");
//         }
//       } catch (error) {
//         console.error("Error fetching search results:", error);
//       } finally {
//         setIsSearching(false); // Stop loading
//       }
//     }, 500), // 500ms delay for debouncing
//     [],
//   );

//   // Update search term and trigger debounced search
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     if (value.trim()) {
//       fetchSearchResults(value); // Fetch results after debouncing
//     } else {
//       setSearchResults([]); // Clear results if search box is empty
//       setIsSearchBoxOpen(false); // Hide search results
//     }
//   };

//   // Close search results on click outside
//   const handleClickOutside = (event) => {
//     if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
//       setIsSearchBoxOpen(false); // Hide search results
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
//         <h1 className="text-2xl font-bold">Manage Users</h1>
//         <div className="flex items-center space-x-4 w-full md:w-auto">
//           {/* Search Box */}
//           <div className="relative w-full md:w-auto" ref={searchBoxRef}>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               placeholder="Search users..."
//               className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
//             />
//             {isSearching && (
//               <div className="absolute right-2 top-2">
//                 <svg
//                   className="animate-spin h-5 w-5 text-gray-500"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//               </div>
//             )}
//             {/* Search Results */}
//             {isSearchBoxOpen && searchResults.length > 0 && (
//               <div className="absolute left-0 right-0 bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 w-full overflow-y-auto z-20 mt-2">
//                 {searchResults.map((user, index) => (
//                   <Link
//                     key={index}
//                     href={`${SiteLinks.manage_single_user.link}/${user._id}`}
//                     className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer transition ease-in-out duration-200"
//                   >
//                     <div>
//                       <p className="font-medium text-blue-500">{user.name}</p>
//                       <p className="text-sm text-gray-500">{user.email}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Add User Button */}
//           <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
//             Add User
//           </button>
//         </div>
//       </div>

//       {/* Cards Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {userCardsData.map((card, index) => (
//           <DashboardCard
//             key={index}
//             title={card.title}
//             description={card.description}
//             buttonLabel={card.buttonLabel}
//             buttonColor={card.buttonColor}
//             link={card.link}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ManageUsersPage;

"use client";
import { backendApi } from "@/data";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SiteLinks } from "@/data";
import { motion } from "framer-motion";
import { LoadingIcon } from "@/components/icons";

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
        {filteredUsers?.map((user, index) => (
          <Link
            key={user?._id ?? `user-${index}`} // Handle missing _id with fallback key
            href={`${SiteLinks.manage_single_user.link}/${user?._id ?? "#"}`} // Ensure the link is safe
          >
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {user?.name ?? "N/A"} {/* Handle missing name */}
              </h2>
              <p className="text-gray-600">
                <span className="font-semibold">Email:</span>{" "}
                {user?.email ?? "N/A"} {/* Handle missing email */}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Phone:</span>{" "}
                {user?.phone ?? "N/A"} {/* Handle missing phone */}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Enrollment:</span>{" "}
                {user?.enrollment ?? "N/A"} {/* Handle missing enrollment */}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Active:</span>{" "}
                {user?.is_active ? "Yes" : "No"}{" "}
                {/* Handle missing is_active */}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Verified:</span>{" "}
                {user?.is_verified ? "Yes" : "No"}{" "}
                {/* Handle missing is_verified */}
              </p>
            </motion.div>
          </Link>
        )) ?? <p>No users found.</p>}{" "}
        {/* Handle missing or empty user list */}
      </div>
    </div>
  );
};

export default AdminUsersPage;
