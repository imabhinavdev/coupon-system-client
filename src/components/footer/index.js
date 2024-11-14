"use client";
import { backendApi } from "@/data";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { LoadingIcon } from "../icons";
import { toast } from "react-toastify";

const Footer = () => {
  const [footer, setFooter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch(backendApi.footer);
        if (response.ok) {
          const data = await response.json();
          setFooter(data.footer);
        } else {
        }
      } catch {
        toast.error("Failed to fetch footer");
      } finally {
        setLoading(false);
      }
    };
    // fetchFooter();
  }, []);

  return (
    <div className="w-full p-3 bg-gray-800 flex justify-center rounded-t-md">
      <p className="text-primary text-center">
        {" "}
        Mady with ❤ by{" "}
        <a href="https://imyash.dev" className="no-underline text-blue-400">
          Yash Soni
        </a>{" "}
        &{" "}
        <a href="https://imabhinav.dev" className="no-underline text-blue-400">
          Abhinav Singh
        </a>{" "}
        | Copyright &#169; Coupon System
      </p>
    </div>
  );
};

export default Footer;
