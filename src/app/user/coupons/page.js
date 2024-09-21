"use client";
import React, { useEffect, useState } from "react";

const Coupons = () => {
  const [couponCategory, setCouponCategory] = useState([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/coupon-category/?isActive=true"
        );
        const data = await response.json();
        console.log(data["coupon_category"]);
        setCouponCategory(data["coupon_category"]);
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
            <button className="bg-primary text-secondary text-sm md:text-md rounded-lg px-4 py-2">
              Pay Now
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Coupons;
