"use client";
import { backendApi, SiteLinks } from "@/data";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { backendUrl } from "@/data";
import { toast } from "react-toastify";
import CouponModal from "@/components/coupon-modal";
import { formatDate } from "@/utils/FormatDate";
import { formatTime } from "@/utils/FormatTime";

const Orders = () => {
  const [transactions, setTransactions] = useState([]);
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
          `${backendApi.history}/?user_id=${user.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setTransactions(data.transactions);
          console.log(data.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Error fetching transactions");
      }
    };

    fetchOrders();
  }, [user.id]); // Add user.id to dependencies

  return (
    <div className="flex-grow h-full flex items-start justify-center bg-secondary rounded-xl">
      {transactions.length > 0 ? (
        <div className="w-full mx-auto p-4">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Your Transactions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-primary text-secondary px-6 py-2 rounded-xl shadow-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="md:text-xl text-md font-semibold">
                    {transaction.coupon_category.name}
                  </h3>
                  <span className="text-sm text-gray-400">
                    {formatDate(transaction.created_at)} <br />
                    {formatTime(transaction.created_at)}
                  </span>
                  <p className="mt-2">₹{transaction.coupon_category.price}</p>
                </div>
                {/* <button
                  onClick={() =>
                    handleModal({
                      id: order.id,
                      user_id: order.user_id,
                      coupon_category: order.coupon_category,
                    })
                  }
                  className="bg-secondary text-primary md:px-4 md:py-2 p-2 text-sm md:text-md  rounded-lg"
                >
                  View Details
                </button> */}
                <span
                  className={`${
                    transaction.is_captured ? "bg-green-500" : "bg-red-500"
                  } p-2 rounded-full text-primary
                    `}
                >
                  {transaction.is_captured ? "Success" : "Failed"}
                </span>
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
            Looks like you haven&apos;t placed any transactions yet. Start
            shopping now!
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
