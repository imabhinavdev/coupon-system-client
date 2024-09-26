"use client";
import { useState, createContext, useEffect } from "react";
import { backendApi, backendUrl } from "@/data";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(backendApi.who_am_i, {
          method: "GET",
          credentials: "include",
        });
        // const response = await fetch(`/api/auth/whoami`, {
        //   method: "GET",
        //   credentials: "include",
        // });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchUser();
  }, []);

  // Return a loading indicator while fetching user data
  if (loading) {
    return <div>Loading...</div>; // You can customize this loading component
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
