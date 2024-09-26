import React, { useContext } from "react";
import { backendUrl } from "@/data";
import { UserContext } from "@/context/UserContext";
import { LogoutIcon } from "@/components/icons";

const Logout = ({ className }) => {
  const { setUser } = useContext(UserContext);
  const logout = async () => {
    try {
      // const response = await fetch(`/api/auth/logout`, {
      //   method: "POST",
      //   credentials: "include",
      // });
      const response = await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setUser(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <p
      className={`flex justify-center cursor-pointer ${className}`}
      onClick={logout}
    >
      Logout
      <LogoutIcon className="text-primary" />
    </p>
  );
};

export default Logout;
