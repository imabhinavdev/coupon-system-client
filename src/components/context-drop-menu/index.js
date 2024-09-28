import React, { useState, useEffect, useRef } from "react";
import { DeleteIcon, EditIcon, ThreeDotsIcon } from "../icons";
import ConfirmationModal from "@/components/confirmation-modal";

const DropdownMenu = ({ onDelete, onEdit, onToggleActive, category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = () => {
    setShowConfirmation(true);
    setIsOpen(false);
  };

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleToggleActive = () => {
    onToggleActive();
    setIsOpen(false); // Close menu after the action
  };

  const confirmDelete = () => {
    onDelete();
    setShowConfirmation(false); // Close the modal after confirming delete
  };

  const cancelDelete = () => {
    setShowConfirmation(false); // Close the modal without deleting
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
              onClick={handleDelete}
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

      {showConfirmation && (
        <ConfirmationModal
          label={`Are you sure you want to delete ${category} item?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default DropdownMenu;
