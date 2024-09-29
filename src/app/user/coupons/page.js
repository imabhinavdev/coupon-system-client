"use client";
import PaymentComponent from "@/components/payment";
import { backendApi } from "@/data";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles

const Coupons = () => {
  const [couponCategory, setCouponCategory] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(backendApi.active_coupon_category);
        const data = await response.json();
        if (response.ok) {
          setCouponCategory(data["coupon_category"]);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error("Error fetching coupons");
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchCoupons();
  }, []);

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 md:p-0 gap-8">
      {loading ? (
        [...Array(3)].map((_, index) => (
          <div
            className="bg-secondary flex justify-between items-center text-primary rounded-xl px-12 py-4"
            key={index}
          >
            <div>
              <Skeleton height={30} width={150} />
              <Skeleton height={20} width={100} />
            </div>
            <Skeleton height={40} width={100} />
          </div>
        ))
      ) : couponCategory.length > 0 ? (
        couponCategory.map((coupon) => (
          <div
            className="bg-secondary flex justify-between items-center text-primary rounded-xl px-12 py-4"
            key={coupon.id}
          >
            <div>
              <h3 className="md:text-2xl text-md">{coupon.name}</h3>
              <p>₹{coupon.price}</p>
            </div>
            <PaymentComponent coupon_category={coupon} />
          </div>
        ))
      ) : (
        <p>No coupons available.</p>
      )}
    </div>
  );
};

export default Coupons;
