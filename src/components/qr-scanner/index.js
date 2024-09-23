"use client";
import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CrossIcon, LoadingIcon } from "@/components/icons"; // Importing the CrossIcon
import { backendApi } from "@/data";
import { toast } from "react-toastify";
const QRScannerModal = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const html5QrcodeScannerRef = useRef(null);

  const onScanSuccess = (decodedText, decodedResult) => {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    try {
      const parsedData = JSON.parse(decodedText);
      setData(parsedData);
      verifyCoupon(parsedData);
      console.log(`Parsed Data:`, parsedData);

      // Stop and clear scanner after success
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current
          .clear()
          .then(() => {
            console.log("QR Code scanner cleared.");
          })
          .catch((error) => {
            console.error("Failed to clear QR Code scanner.", error);
          });
      }
    } catch (error) {
      console.error("QR code parse error:", error);
    }
  };

  const onScanFailure = (error) => {
    console.warn(`Code scan error = ${error}`);
  };

  const startScanner = () => {
    if (html5QrcodeScannerRef.current === null) {
      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 5, qrbox: { width: 250, height: 250 } },
        false
      );
      html5QrcodeScannerRef.current.render(onScanSuccess, onScanFailure);
    }
  };

  const verifyCoupon = async (coupon) => {
    try {
      const response = await fetch(
        `${backendApi.verify_coupon}/${coupon.coupon_id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        console.log(data);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Verification Failed");
    } finally {
      setData(null);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().catch((error) => {
        console.error("Failed to clear QR Code scanner.", error);
      });
      html5QrcodeScannerRef.current = null; // Reset the reference to null
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      startScanner();
    }
  }, [isModalOpen]);

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Scan Now
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-red-500"
            >
              <CrossIcon />
            </button>
            <h2 className="text-lg font-semibold mb-4">Scan QR Code</h2>
            {data ? (
              <div className="h-full w-full">
                <LoadingIcon className="w-full h-full" />
              </div>
            ) : (
              <div
                id="reader"
                style={{ width: "300px", height: "300px" }}
              ></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScannerModal;
