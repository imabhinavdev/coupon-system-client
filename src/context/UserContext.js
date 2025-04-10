"use client";
import { useState, createContext, useEffect } from "react";
import { backendApi } from "@/data";
import { LoadingIcon } from "@/components/icons";
import { usePathname } from "next/navigation";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [userPermissions, setUserPermissions] = useState(null);
  const pathname = usePathname();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(backendApi.who_am_i, {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
          setUserPermissions(data.user.permissions);
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
    <>
      <div className="flex w-full h-full justify-center items-center flex-grow min-h-full">
        <LoadingIcon color="#000" className="w-6 h-6" />
      </div>
    </>
  );

  if (loading && pathname !== "/") {
    return <Loader />;
  }

  return (
    <UserContext.Provider value={{ user, setUser, userPermissions }}>
      {children}
    </UserContext.Provider>
  );
};
