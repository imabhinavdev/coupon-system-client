"use client";
import { backendApi } from "@/data";
import React from "react";
import { useEffect, useState } from "react";

const StaffDashboardScannedList = () => {
  const [scannedCouponsList, setScannedCouponsList] = useState([]);

  const fetchScannedCoupons = async () => {
    try {
      const response = await fetch(backendApi.scanned_coupons);

      if (response.ok) {
        const data = await response.json();
        setScannedCouponsList(data.coupons);
      } else {
        console.log("Error fetching data");
      }
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchScannedCoupons();
  }, []);

  return (
    <div className="p-4 w-full">
      {scannedCouponsList.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border border-black shadow-lg rounded-lg">
            <thead className="bg-black text-white sticky top-0">
              <tr>
                <th className="py-2 px-4 sm:px-6 text-left font-semibold">
                  S.No
                </th>
                <th className="py-2 px-4 sm:px-6 text-left font-semibold">
                  User Name
                </th>
                <th className="py-2 px-4 sm:px-6 text-left font-semibold">
                  Email
                </th>
                <th className="py-2 px-4 sm:px-6 text-left font-semibold">
                  Category
                </th>
                <th className="py-2 px-4 sm:px-6 text-left font-semibold">
                  Price
                </th>
                <th className="py-2 px-4 sm:px-6 text-left font-semibold">
                  No. of Persons
                </th>
                <th className="py-2 px-4 sm:px-6 text-left font-semibold">
                  Transaction ID
                </th>
                <th className="py-2 px-4 sm:px-6 text-left font-semibold">
                  Scanned By
                </th>
                
              </tr>
            </thead>
            <tbody>
              {scannedCouponsList.map((coupon, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="py-3 px-4 sm:px-6 text-black font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-black">
                    {coupon.userId.name}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-black">
                    {coupon.userId.email}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-black">
                    {coupon.couponCategoryId.name}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-black">
                    {coupon.couponCategoryId.price}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-black">
                    {coupon.noOfPerson}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-black">
                    {coupon.transactionId}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-black">
                    {coupon.scannedBy.name}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-indigo-600 font-bold text-xl py-6">
          No Coupons Scanned
        </div>
      )}
    </div>
  );
};

export default StaffDashboardScannedList;
