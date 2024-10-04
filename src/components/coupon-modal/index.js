import { useState } from "react";
import { CrossIcon } from "@/components/icons";
import GenerateQR from "@/components/qrcode-generate";

const CouponModal = ({ isOpen = true, user = "", onClose, coupon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 p-2 md:p-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative flex flex-col justify-center">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <CrossIcon />
        </button>

        <h2 className="text-xl font-semibold text-secondary text-center mb-4">
          QR Code
        </h2>

        <GenerateQR coupon={coupon} />
      </div>
    </div>
  );
};

export default CouponModal;
