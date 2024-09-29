"use client";
import React, { useState } from "react";
import QRScannerModal from "@/components/qr-scanner-modal";

const QRButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQRScan = () => {
    setIsModalOpen(true); // Open the modal
  };
  return (
    <>
      <button
        className="bg-secondary hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out"
        onClick={handleQRScan}
      >
        Scan QR
      </button>
      <QRScannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default QRButton;
