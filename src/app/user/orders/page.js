"use client";
import { backendApi, SiteLinks } from "@/data";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import CouponModal from "@/components/coupon-modal";
import { formatDate } from "@/utils/FormatDate";
import { formatTime } from "@/utils/FormatTime";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton styles

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
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
          `${backendApi.coupons}?user_id=${user._id}&is_used=false`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          const sortedOrders = data.coupons.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at) // Sort in descending order
          );
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchOrders();
  }, [user._id]);

  return (
    <div className="flex-grow h-full flex items-start justify-center bg-secondary rounded-xl">
      {loading ? (
        <div className="w-full mx-auto p-4">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Your Orders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-primary text-secondary px-6 py-2 rounded-xl shadow-lg flex justify-between items-center"
              >
                <Skeleton height={50} width="80%" />
                <Skeleton height={20} width="70%" />
                <Skeleton height={30} width="65%" />
              </div>
            ))}
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="w-full mx-auto p-4">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Your Orders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-primary text-secondary px-6 py-2 rounded-xl shadow-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="md:text-xl text-md font-semibold">
                    {order.couponCategoryId.name}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                  </span>
                  <p className="mt-2">₹{order.couponCategoryId.price}</p>
                </div>
                <button
                  onClick={() =>
                    handleModal({
                      id: order._id,
                      userId: order.userId,
                      couponCategoryId: order.couponCategoryId._id,
                    })
                  }
                  className="bg-secondary text-primary md:px-4 md:py-2 p-2 text-sm md:text-md  rounded-lg"
                >
                  View QR
                </button>
              </div>
            ))}
          </div>
          <CouponModal
            isOpen={showModal}
            onClose={handleModal}
            coupon={selectedCoupon} // Pass the selected coupon
          />
        </div>
      ) : (
        <div className="text-center flex flex-col p-4 gap-4">
          <h2 className="text-4xl font-bold text-primary mb-4">No Orders Yet</h2>
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
