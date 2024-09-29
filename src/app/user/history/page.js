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
import "react-loading-skeleton/dist/skeleton.css";

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const handleModal = (coupon = null) => {
    setSelectedCoupon(coupon);
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${backendApi.history}?user_id=${user._id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          toast.error("Error fetching transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user._id]);

  return (
    <>
      {loading ? (
        <div className="flex-grow h-full flex items-start justify-center rounded-xl">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-secondary mb-6 text-left">
              <Skeleton width={200} />
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-primary border border-gray-200">
                <thead>
                  <tr>
                    {[
                      "Sr. No.",
                      "Coupon Name",
                      "Date",
                      "Time",
                      "Price",
                      "Status",
                    ].map((heading, idx) => (
                      <th
                        key={idx}
                        className="py-3 px-4 text-left text-secondary border-b border-gray-300"
                      >
                        <Skeleton width={80} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-300">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <td key={i} className="py-3 px-4">
                          <Skeleton width={100} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="flex-grow h-full flex items-start justify-center rounded-xl">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-secondary mb-6 text-left">
              Your Transactions
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full bg-primary border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-secondary border-b border-gray-300">
                      Sr. No.
                    </th>
                    <th className="py-3 px-4 text-left text-secondary border-b border-gray-300">
                      Coupon Name
                    </th>
                    <th className="py-3 px-4 text-left text-secondary border-b border-gray-300">
                      Purchasing Date
                    </th>
                    <th className="py-3 px-4 text-left text-secondary border-b border-gray-300">
                      Purchasing Time
                    </th>
                    <th className="py-3 px-4 text-left text-secondary border-b border-gray-300">
                      Scanned Date
                    </th>
                    <th className="py-3 px-4 text-left text-secondary border-b border-gray-300">
                      Scanned Time
                    </th>
                    <th className="py-3 px-4 text-left text-secondary border-b border-gray-300">
                      Price
                    </th>
                    <th className="py-3 px-4 text-left text-secondary border-b border-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, idx) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-300"
                    >
                      <td className="py-3 px-4 text-secondary">{idx + 1}</td>
                      <td className="py-3 px-4 text-secondary">
                        {transaction.couponCategoryId.name}
                      </td>
                      <td className="py-3 px-4 text-secondary">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-secondary">
                        {formatTime(transaction.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-secondary">
                        {formatDate(transaction.updatedAt)}
                      </td>
                      <td className="py-3 px-4 text-secondary">
                        {formatTime(transaction.updatedAt)}
                      </td>
                      <td className="py-3 px-4 text-secondary">
                        ₹{transaction.couponCategoryId.price}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            transaction.isCaptured
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.isCaptured ? "Success" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CouponModal
              isOpen={showModal}
              onClose={handleModal}
              coupon={selectedCoupon}
            />
          </div>
        </div>
      ) : (
        <div className="flex-grow h-full flex items-start justify-center rounded-xl bg-secondary">
          <div className="text-center flex flex-col p-4 gap-4">
            <h2 className="text-4xl font-bold text-primary mb-4">
              No Transactions Yet
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
        </div>
      )}
    </>
  );
};

export default HistoryPage;
