"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { CrossIcon, LoadingIcon } from "@/components/icons";
import { backendApi } from "@/data";
import { toast } from "react-toastify";
import { UserContext } from "@/context/user";

const QRScannerModal = () => {
  const [data, setData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const html5QrcodeScannerRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [rearCameraId, setRearCameraId] = useState(null);
  const { user } = useContext(UserContext);
  // Request camera permissions and find the rear camera
  const getCameraPermissions = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        // Find rear camera (usually back cameras have 'back' in their label)
        const rearCamera = devices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear")
        );
        setRearCameraId(rearCamera ? rearCamera.id : devices[0].id); // Use the rear camera or default to the first one
      } else {
        toast.error("No cameras found.");
      }
    } catch (error) {
      console.error("Error getting camera permissions:", error);
      toast.error("Failed to get camera permissions.");
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    try {
      const parsedData = JSON.parse(decodedText);
      setData(parsedData);
      verifyCoupon(parsedData);
      console.log(`Parsed Data:`, parsedData);
    } catch (error) {
      console.error("QR code parse error:", error);
    }
  };

  const onScanFailure = (error) => {
    console.warn(`Code scan error = ${error}`);
  };

  const startScanner = () => {
    if (rearCameraId && !scanner) {
      const html5QrcodeScanner = new Html5Qrcode("reader");
      setScanner(html5QrcodeScanner);
      html5QrcodeScanner
        .start(
          { deviceId: { exact: rearCameraId } }, // Use rear camera by default
          { fps: 5, qrbox: { width: 250, height: 250 } },
          onScanSuccess,
          onScanFailure
        )
        .catch((error) => {
          console.error("Failed to start QR Code scanner.", error);
        });
    }
  };

  const verifyCoupon = async (coupon) => {
    try {
      const response = await fetch(
        `${backendApi.verify_coupon}${coupon.couponId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scannedBy: user._id }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        closeModal();
      } else {
        console.log(data);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Verification Failed");
    } finally {
      setData(null); // Reset data to allow for another scan
    }
  };

  const closeModal = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          scanner.clear();
          setScanner(null);
        })
        .catch((error) => {
          console.error("Failed to stop the scanner:", error);
        });
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      getCameraPermissions().then(() => {
        startScanner();
      });
    }
  }, [isModalOpen, rearCameraId]);

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
                <LoadingIcon className="w-12 h-12" />
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
