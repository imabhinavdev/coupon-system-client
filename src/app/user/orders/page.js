"use client";
import { SiteLinks } from "@/data";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { backendUrl } from "@/data";
import { toast } from "react-toastify";
import CouponModal from "@/components/coupon-modal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null); // State for the selected coupon
  const { user } = useContext(UserContext);

  const handleModal = (coupon = null) => {
    setSelectedCoupon(coupon); // Set selected coupon for the modal
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/coupon/?user_id=${user.id}`
        );
        const data = await response.json();
        if (response.ok) {
          setOrders(data.coupons);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchOrders();
  }, [user.id]); // Add user.id to dependencies

  return (
    <div className="flex-grow h-full flex items-start justify-center bg-secondary rounded-xl">
      {orders.length > 0 ? (
        <div className="w-full mx-auto p-4">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Your Orders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-primary text-secondary p-6 rounded-xl shadow-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">
                    {order.coupon_category.name}
                  </h3>
                  <span className="text-sm text-gray-400">21-08-2024</span>
                  <p className="mt-2">₹{order.coupon_category.price}</p>
                </div>
                <button
                  onClick={() =>
                    handleModal({
                      id: order.id,
                      user_id: order.user_id,
                      coupon_category: order.coupon_category,
                    })
                  }
                  className="bg-secondary text-primary px-4 py-2 rounded-lg"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
          {/* Render modal outside of the map */}
          <CouponModal
            isOpen={showModal}
            onClose={handleModal}
            coupon={selectedCoupon} // Pass the selected coupon
          />
        </div>
      ) : (
        <div className="text-center flex flex-col p-4 gap-4">
          <h2 className="text-4xl font-bold text-primary mb-4">
            No Orders Yet
          </h2>
          <p className="text-xl text-primary">
            Looks like you haven&apos;t placed any orders yet. Start shopping now!
          </p>
          <Link
            href={SiteLinks.coupons.link}
            className="bg-primary text-secondary px-6 py-3 rounded-lg"
          >
            Explore Coupons
          </Link>
        </div>
      )}
    </div>
  );
};

export default Orders;
