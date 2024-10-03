"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { backendApi } from "@/data";
import { toast } from "react-toastify";
import { UserContext } from "@/context/UserContext";
const QRScannerModal = ({ isOpen, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const qrCodeScannerRef = useRef(null); // Create a ref for the QR code scanner
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (isOpen) {
      const fetchCameras = async () => {
        try {
          const devices = await Html5Qrcode.getCameras();
          setCameras(devices);
          if (devices.length) {
            setSelectedCameraId(devices[1].id); // Default camera
          }
        } catch (err) {
          console.error("Error getting cameras:", err);
        }
      };
      fetchCameras();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedCameraId) {
      startScanning();
    }
  }, [isOpen, selectedCameraId]);

  const stopScanning = () => {
    if (qrCodeScannerRef.current) {
      qrCodeScannerRef.current
        .stop()
        .then(() => {
          setScanning(false); // Reset scanning state when stopped
          onClose(); // Optionally handle modal close or reset
        })
        .catch((err) => {
          console.error("Error stopping scanning:", err);
        });
    }
  };

  const fetchData = async (decodedText) => {
    try {
      const { couponId } = decodedText; // Extract coupon_id from decodedText
      const response = await fetch(`${backendApi.verify_coupon}${couponId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scannedBy: user._id }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        toast.success(`Valid for ${data.noOfPerson} person(s)`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const startScanning = () => {
    const qrCodeScanner = new Html5Qrcode("reader");
    qrCodeScannerRef.current = qrCodeScanner; // Store the scanner instance in ref

    qrCodeScanner
      .start(
        { deviceId: { exact: selectedCameraId } },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
        },
        (decodedText) => {
          if (!scanning) {
            setScanning(true); // Set scanning to true immediately
            stopScanning(); // Stop scanning immediately
            onClose(decodedText); // Pass the scanned code to the onClose
            fetchData(JSON.parse(decodedText));
          }
        },
        (errorMessage) => {
          console.warn("QR scanning error:", errorMessage);
        },
      )
      .then(() => {
        setScanning(true); // Set scanning to true when it starts
      })
      .catch((err) => {
        console.error("Error starting scan:", err);
      });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          {" "}
          <h2 className="text-lg font-bold text-center">Scan QR Code</h2>
          <div
            id="reader"
            className="w-full aspect-[3/2] border-2 border-gray-300 mb-4"
          ></div>{" "}
          <button
            onClick={() => {
              stopScanning();
              onClose();
            }}
            className="mt-4 bg-red-500 text-white rounded-md px-4 py-2 w-full" // Set button to w-full for full width
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default QRScannerModal;
