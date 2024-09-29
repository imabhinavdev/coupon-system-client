"use client";
import { useState, createContext, useEffect } from "react";
import { backendApi } from "@/data";
import Skeleton from "react-loading-skeleton";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(backendApi.who_am_i, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const Loader = () => (
    <div className="skeleton">
      <Skeleton height="100%" containerClassName="flex-1 h-full" />
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
