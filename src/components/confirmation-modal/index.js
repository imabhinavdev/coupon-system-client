import React from "react";

const ConfirmationModal = ({ label, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 p-8">
        <h2 className="text-lg font-bold mb-4">{label}</h2>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 w-full bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 w-full bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
