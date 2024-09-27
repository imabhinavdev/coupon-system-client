import React, { useState, useEffect, useRef } from "react";
import { DeleteIcon, EditIcon, ThreeDotsIcon } from "../icons";

const DropdownMenu = ({ onDelete, onEdit, onToggleActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // To reference the dropdown menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    // If the click happens outside the menuRef, close the dropdown
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = () => {
    onDelete();
    setIsOpen(false); // Close menu after the action
  };

  const handleEdit = () => {
    onEdit();
    setIsOpen(false); // Close menu after the action
  };

  const handleToggleActive = () => {
    onToggleActive();
    setIsOpen(false); // Close menu after the action
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        onClick={toggleMenu}
        className="text-gray-500 hover:text-gray-700"
      >
        <ThreeDotsIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-2 mt-2 w-48 bg-white shadow-lg rounded-xl py-2 border border-gray-200 z-10">
          <div className="py-1">
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 w-full "
            >
              <span>
                <EditIcon />
              </span>
              <span className="self-end">Edit</span>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-gray-100 w-full text-left"
            >
              <span>
                <DeleteIcon className="text-red-600" />
              </span>
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
