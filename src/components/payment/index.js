"use client";
import GenerateQR from "@/components/qrcode-generate";
import React, { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { backendUrl } from "@/data";

const PaymentComponent = ({ coupon_category }) => {
  const [coupon, setCoupon] = useState(null);
  const { user } = useContext(UserContext);

  const handlePayment = async (e) => {
    e.preventDefault(); 

    const formData = new FormData();
    formData.append("coupon_category_id", coupon_category.id);
    formData.append("user_id", user.id);
    formData.append("coupon_category_price", coupon_category.price);

    try {
      const response = await fetch(`${backendUrl}/payment/order`, {
        method: "POST",
        body: formData, // Send the formData directly
      });

      const data = await response.json();
      console.log(data);
      const orderID = data.data.id;
      const transactionId = data.data.transaction_id;

      var options = {
        key: "rzp_test_FivlgkZZzZspfT", // Enter the Key ID generated from the Dashboard
        amount: `${coupon_category.price}00`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Ikshana",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: orderID, // Order ID from your server response
        handler: function (response) {
          verifySignature(
            response.razorpay_signature,
            transactionId,
            response.razorpay_payment_id,
            response.razorpay_order_id
          );
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },

        theme: {
          color: "#000",
        },
      };

      var rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(`Payment failed! Error Code: ${response.error.code}`);
        alert(`Description: ${response.error.description}`);
        alert(`Source: ${response.error.source}`);
        alert(`Step: ${response.error.step}`);
        alert(`Reason: ${response.error.reason}`);
        alert(`Order ID: ${response.error.metadata.order_id}`);
        alert(`Payment ID: ${response.error.metadata.payment_id}`);
      });

      rzp1.open(); // Trigger the payment
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const verifySignature = async (
    razorpay_signature,
    transaction_id,
    razorpay_payment_id,
    razorpay_order_id
  ) => {
    const formData = new FormData();
    formData.append("razorpay_signature", razorpay_signature);
    formData.append("transaction_id", transaction_id);
    formData.append("razorpay_payment_id", razorpay_payment_id);
    formData.append("razorpay_order_id", razorpay_order_id);

    try {
      const response = await fetch(`${backendUrl}/payment/verify`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.dir(data);
      const couponData = {};
      couponData["coupon_category"] = data.data.coupon_category_name;
      couponData["id"] = data.data.id;
      couponData["user_id"] = data.data.user_id;
      console.dir(couponData);
      setCoupon(couponData);
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  return (
    <button
      className="bg-primary text-secondary text-sm md:text-md rounded-lg px-4 py-2"
      onClick={handlePayment}
    >
      Pay Now
    </button>
  );
};

export default PaymentComponent;
