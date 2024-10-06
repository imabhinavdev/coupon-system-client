"use client";
import { backendApi } from "@/data";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const FooterManagement = ({ footer, setFooter }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newFooterValue, setNewFooterValue] = useState("");

  useEffect(() => {
    setNewFooterValue(footer.value);
  }, [footer]);

  const handleInputChange = (e) => {
    setNewFooterValue(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);

    const updatedFooter = { value: newFooterValue };
    setFooter(updatedFooter);

    try {
      const response = await fetch(backendApi.footer, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFooter),
      });

      if (response.ok) {
        toast.success("Footer updated successfully");
      } else {
        toast.error("Error updating footer");
      }
    } catch (err) {
      toast.error("Error occurred while updating footer");
    }
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Footer Management</h1>
      <table className="table-fixed w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="w-[90%] text-left px-4 py-2 text-gray-600">Footer Content</th>
            <th className="w-[10%] text-left px-4 py-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 overflow-hidden">
              {!isEditing ? (
                <p className="text-gray-700 text-lg font-semibold truncate">{footer.value}</p>
              ) : (
                <input
                  type="text"
                  value={newFooterValue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new footer content"
                />
              )}
            </td>
            <td className="border px-4 py-2">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSaveClick}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
                >
                  Save
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const WebsiteNameManagement = ({ websiteName, setWebsiteName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newWebsiteName, setNewWebsiteName] = useState("");

  useEffect(() => {
    setNewWebsiteName(websiteName.value);
  }, [websiteName]);

  const handleInputChange = (e) => {
    setNewWebsiteName(e.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);

    const updatedWebsiteName = { value: newWebsiteName };
    setWebsiteName(updatedWebsiteName);

    try {
      const response = await fetch(backendApi.website_name, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWebsiteName),
      });

      if (response.ok) {
        toast.success("Website name updated successfully");
      } else {
        toast.error("Error updating website name");
      }
    } catch (err) {
      toast.error("Error occurred while updating website name");
    }
  };

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Website Name Management</h1>
      <table className="table-fixed w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="w-[90%] text-left px-4 py-2 text-gray-600">Website Name</th>
            <th className="w-[10%] text-left px-4 py-2 text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2 overflow-hidden">
              {!isEditing ? (
                <p className="text-gray-700 text-lg font-semibold truncate">{websiteName.value}</p>
              ) : (
                <input
                  type="text"
                  value={newWebsiteName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new website name"
                />
              )}
            </td>
            <td className="border px-4 py-2">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSaveClick}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
                >
                  Save
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const Setting = () => {
  const [footer, setFooter] = useState("");
  const [websiteName, setWebsiteName] = useState("");

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await fetch(backendApi.footer);
        if (response.ok) {
          const data = await response.json();
          setFooter(data.footer);
        } else {
          toast.error("Error fetching footer data");
        }
      } catch (err) {
        toast.error("Error occurred while fetching footer data");
      }
    };

    const fetchWebsiteName = async () => {
      try {
        const response = await fetch(backendApi.website_name);
        if (response.ok) {
          const data = await response.json();
          setWebsiteName(data.websiteName);
        } else {
          toast.error("Error fetching website name data");
        }
      } catch (err) {
        toast.error("Error occurred while fetching website name data");
      }
    };

    fetchFooter();
    fetchWebsiteName();
  }, []);

  return (
    <div className="w-full flex-grow p-4 bg-white shadow-lg rounded-lg">
      <FooterManagement footer={footer} setFooter={setFooter} />
      <WebsiteNameManagement websiteName={websiteName} setWebsiteName={setWebsiteName} />
    </div>
  );
};

export default Setting;
