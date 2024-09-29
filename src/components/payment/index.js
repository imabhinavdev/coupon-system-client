"use client";
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { backendUrl } from "@/data";
import CouponModal from "@/components/coupon-modal";
import { toast } from "react-toastify";
import { LoadingIcon } from "@/components/icons";
import { set } from "lodash";

const PaymentComponent = ({ coupon_category, label = "Pay Now" }) => {
  const [coupon, setCoupon] = useState();
  const { user } = useContext(UserContext);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        setRazorpayReady(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
      };
      document.body.appendChild(script);
    };

    loadRazorpay();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      coupon_category_id: coupon_category._id,
      user_id: user._id,
      coupon_category_price: coupon_category.price,
    };

    try {
      const response = await fetch(`${backendUrl}/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      setLoading(false);

      const orderID = data.data.id;
      const transactionId = data.data.transaction_id;

      if (razorpayReady) {
        var options = {
          key: "rzp_test_FivlgkZZzZspfT",
          amount: `${coupon_category.price}00`,
          currency: "INR",
          name: "Coupon System",
          description: "One Stop for all your coupon needs",
          image: "https://example.com/your_logo",
          order_id: orderID,
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
          toast.error("Payment failed");
        });

        rzp1.open();
      } else {
        console.error("Razorpay is not ready");
      }
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
    setQrLoading(true);
    const dataToSend = {
      razorpay_signature,
      transaction_id,
      razorpay_payment_id,
      razorpay_order_id,
    };

    try {
      const response = await fetch(`${backendUrl}/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      const couponData = {
        coupon_category: data.data.coupon_category_name,
        id: data.data.id,
        user_id: data.data.user_id,
      };
      setCoupon(couponData);
    } catch (error) {
      console.error("Error during payment verification:", error);
    } finally {
      setQrLoading(false);
    }
  };

  const [modalOpen, setModalOpen] = useState(true);
  const handleOnClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button
        className={`${
          loading ? "bg-gray-200" : "bg-primary"
        } text-secondary text-sm md:text-md rounded-lg px-4 py-2`}
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <>
            <LoadingIcon color="#000" />
          </>
        ) : (
          label
        )}
      </button>
      {coupon && (
        <CouponModal
          coupon={coupon}
          isOpen={modalOpen}
          onClose={handleOnClose}
        />
      )}

      {/* Modal of loading animation */}
      {qrLoading && (
        <div className="fixed p-2 md:p-0 inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <LoadingIcon color="#000" className="w-10 h-10" />
        </div>
      )}
    </>
  );
};

export default PaymentComponent;
