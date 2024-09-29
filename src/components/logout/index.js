import React, { useContext } from "react";
import { backendApi, backendUrl } from "@/data";
import { UserContext } from "@/context/UserContext";
import { LogoutIcon } from "@/components/icons";

const Logout = ({ className }) => {
  const { setUser } = useContext(UserContext);
  const logout = async () => {
    try {
      // const response = await fetch(`/api/auth/logout`, {
      //   method: "POST",
      //
      // });
      const response = await fetch(backendApi.logout, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <p
      className={`flex justify-between gap-2  cursor-pointer ${className}`}
      onClick={logout}
    >
      <span>Logout</span>
      <LogoutIcon className="text-primary " />
    </p>
  );
};

export default Logout;
