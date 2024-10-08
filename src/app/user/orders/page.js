"use client";
import { backendApi, SiteLinks } from "@/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import CouponModal from "@/components/coupon-modal";
import { formatDate } from "@/utils/FormatDate";
import { formatTime } from "@/utils/FormatTime";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const { user, userPermissions } = useContext(UserContext);
  const router = useRouter();

  const handleModal = (coupon = null) => {
    setSelectedCoupon(coupon);
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (!userPermissions?.includes("seeOrders")) {
      toast.error("You are not authorized to view orders");
      router.push("/"); // Redirect to home page if not authorized
    }
  }, [userPermissions, router]);

  useEffect(() => {
    if (userPermissions?.includes("seeOrders")) {
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
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setOrders(sortedOrders);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast.error("Error fetching orders");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user._id, userPermissions]);

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
      ) : orders?.length > 0 ? (
        <div className="w-full mx-auto p-4">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Your Orders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {orders.map((order) => (
              <div
                key={order?._id ?? order?.id}
                className="bg-primary text-secondary px-6 py-2 rounded-xl shadow-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="md:text-xl text-md font-semibold">
                    {order?.couponCategoryId?.name ?? "Unknown Coupon"}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {formatDate(order?.createdAt) ?? "N/A"} at{" "}
                    {formatTime(order?.createdAt) ?? "N/A"}
                  </span>
                  <p className="mt-2 flex w-full justify-between flex-col md:flex-row">
                    <span>
                      ₹
                      {(order?.couponCategoryId?.price ?? 0) *
                        (order?.noOfPerson ?? 0)}
                    </span>
                    <span>No of Persons: {order?.noOfPerson ?? 0}</span>
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleModal({
                      id: order?._id,
                      userId: order?.userId,
                      couponCategoryId: order?.couponCategoryId?._id,
                    })
                  }
                  className="bg-secondary text-primary md:px-4 md:py-2 p-2 text-sm md:text-md rounded-lg"
                >
                  View QR
                </button>
              </div>
            ))}
          </div>
          <CouponModal
            isOpen={showModal}
            onClose={handleModal}
            coupon={selectedCoupon}
          />
        </div>
      ) : (
        <div className="text-center flex flex-col p-4 gap-4">
          <h2 className="text-4xl font-bold text-primary mb-4">
            No Orders Yet
          </h2>
          <p className="text-xl text-primary">
            Looks like you haven&apos;t placed any orders yet. Start shopping
            now!
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
