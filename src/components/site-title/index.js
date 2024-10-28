"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { backendApi } from "@/data";
import { LoadingIcon } from "../icons";
const SiteIcon = ({ className }) => {
  const [siteName, setSiteName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteName = async () => {
      try {
        const response = await fetch(backendApi.website_name);
        if (response.ok) {
          const data = await response.json();
          setSiteName(data.websiteName);
        } else {
          console.log("Error fetching data");
        }
      } catch {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };
    fetchSiteName();
  }, []);

  return (
    <Link href="/" className={`text-2xl font-bold  ${className}`}>
      {loading ? <LoadingIcon className="w-5 h-5" /> : siteName.value}
    </Link>
  );
};

export default SiteIcon;
