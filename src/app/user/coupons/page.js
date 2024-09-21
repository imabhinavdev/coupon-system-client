"use client";
import PaymentComponent from "@/components/payment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Coupons = () => {
  const [couponCategory, setCouponCategory] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/coupon-category/?isActive=true"
        );
        const data = await response.json();
        if (response.ok) {
          setCouponCategory(data["coupon_category"]);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <>
      <div className="grid md:grid-cols-3 grid-cols-1 md:p-0 gap-8">
        {couponCategory.map((coupon) => (
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
        ))}
      </div>
    </>
  );
};

export default Coupons;
