"use client";
import QRScannerModal from "@/components/qr-scanner";
import StaffDashboardScannedList from "@/components/staff-dashboard-scanned-list";
import React, { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { Permissions } from "@/data";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const StaffDashboard = () => {
  const { userPermissions } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!userPermissions.includes(Permissions.scanQr)) {
      toast.error("You do not have permission to scan QR codes");
      router.push("/");
    }
  }, [userPermissions, router]);

  // Render null if the user lacks the permission to scan QR codes
  if (!userPermissions.includes(Permissions.scanQr)) {
    return null;
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center justify-center flex-grow h-full">
        <h2 className="text-3xl font-bold mb-4">
          Tap the Button to Scan the Coupon
        </h2>
        <QRScannerModal />
        <div>Coupons Scanned</div>
        <StaffDashboardScannedList />
      </div>
    </div>
  );
};

export default StaffDashboard;
