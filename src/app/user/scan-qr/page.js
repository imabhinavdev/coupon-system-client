import QRScannerModal from "@/components/qr-scanner";
import StaffDashboardScannedList from "@/components/staff-dashboard-scanned-list";
import React from "react";

const StaffDashboard = () => {
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
