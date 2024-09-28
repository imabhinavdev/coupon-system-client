"use client";
import React, { useState, useEffect } from "react";
import { Chart, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { backendApi } from "@/data";
import { toast } from "react-toastify";

defaults.aspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 18; // Increase title font size
defaults.plugins.title.color = "black";

const AdminDashboard = () => {
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [revenueOverTime, setRevenueOverTime] = useState([]);
  const [transactionsByWeekday, setTransactionsByWeekday] = useState([]);
  const [couponStatsByWeekday, setCouponStatsByWeekday] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);

  const [activeTab, setActiveTab] = useState("profile"); // Add state to track active tab

  const fetchRevenueByCategory = async () => {
    try {
      const response = await fetch(backendApi.revenue_by_category);
      const data = await response.json();
      if (response.ok) {
        setRevenueByCategory(data.revenue_by_category);
      } else {
        toast.error("Failed to fetch revenue by category data");
      }
    } catch (error) {
      toast.error("Failed to fetch revenue by category data");
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await fetch(backendApi.total_revenue);
      const data = await response.json();
      if (response.ok) {
        setTotalRevenue(data.total_revenue);
      } else {
        toast.error("Failed to fetch total revenue data");
      }
    } catch (error) {
      toast.error("Failed to fetch total revenue data");
    }
  };

  const fetchRevenueOverTime = async () => {
    try {
      const response = await fetch(backendApi.revenue_over_time);
      const data = await response.json();
      if (response.ok) {
        setRevenueOverTime(data.revenue);
      } else {
        toast.error("Failed to fetch revenue over time data");
      }
    } catch (error) {
      toast.error("Failed to fetch revenue over time data");
    }
  };

  const fetchCouponStatsbyWeekday = async () => {
    try {
      const response = await fetch(backendApi.revenue_by_weekday);
      const data = await response.json();
      if (response.ok) {
        setTransactionsByWeekday(data.coupon_stats_by_weekday);
        // Process data to store it in couponStatsByWeekday
        const statsByWeekday = [
          { day: "Sunday", ...data.coupon_stats_by_weekday["1"] },
          { day: "Monday", ...data.coupon_stats_by_weekday["2"] },
          { day: "Tuesday", ...data.coupon_stats_by_weekday["3"] },
          { day: "Wednesday", ...data.coupon_stats_by_weekday["4"] },
          { day: "Thursday", ...data.coupon_stats_by_weekday["5"] },
          { day: "Friday", ...data.coupon_stats_by_weekday["6"] },
          { day: "Saturday", ...data.coupon_stats_by_weekday["7"] },
        ];
        setCouponStatsByWeekday(statsByWeekday);
      } else {
        toast.error("Failed to fetch coupon stats by weekday data");
      }
    } catch (error) {
      toast.error("Failed to fetch coupon stats by weekday data");
    }
  };

  useEffect(() => {
    fetchRevenueByCategory();
    fetchRevenueOverTime();
    fetchCouponStatsbyWeekday();
    fetchTotalRevenue();
  }, []);

  return (
    <>
      <div className="text-3xl font-semibold mb-2 flex flex-col md:flex-row gap-5 md:gap-0 justify-between">
        <h1> Admin Dashboard</h1>
        <h1 className="text-2xl font-semibold mb-4">
          Total Revenue:{" "}
          <span className="text-blue-700 p-2 font-black text-3xl md:text-5xl rounded-lg shadow-md border border-gray-100 ">
            ₹ {totalRevenue}
          </span>
        </h1>
      </div>
      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <ul
          className="flex flex-nowrap -mb-px text-sm font-medium text-center"
          role="tablist"
        >
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "profile" ? "border-blue-600 text-blue-600" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Revenue Distribution
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "dashboard" ? "border-blue-600 text-blue-600" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              Revenue Comparison
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "settings" ? "border-blue-600 text-blue-600" : ""
              }`}
              onClick={() => setActiveTab("settings")}
            >
              Revenue Over Time
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === "contacts" ? "border-blue-600 text-blue-600" : ""
              }`}
              onClick={() => setActiveTab("contacts")}
            >
              Coupons by sold
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Contents */}
      <div id="default-tab-content">
        {activeTab === "profile" && (
          <div className="p-4 rounded-lg md:h-[60vh]  w-full bg-gray-50 dark:bg-gray-800">
            <DoughnutChart data={revenueByCategory} />
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="p-4 rounded-lg md:h-[60vh] bg-gray-50 dark:bg-gray-800">
            <BarChart data={revenueByCategory} />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-4 rounded-lg md:h-[60vh] bg-gray-50 dark:bg-gray-800">
            <LineChart data={revenueOverTime} />
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="p-4 rounded-lg md:h-[60vh] bg-gray-50 dark:bg-gray-800">
            <WeekdayBarChart data={couponStatsByWeekday} />
          </div>
        )}
      </div>
    </>
  );
};

const DoughnutChart = ({ data, label = "Revenue Distribution" }) => {
  const backgroundColors = data.map(() => generateRandomColor());

  return (
    <div className="w-full md:h-full h-96 flex justify-center">
      <Doughnut
        data={{
          labels: data.map((item) => item._id),
          datasets: [
            {
              label: "Revenue by Category",
              data: data.map((item) => item.revenue),
              backgroundColor: backgroundColors,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              text: label,
            },
          },
          responsive: true,
        }}
      />
    </div>
  );
};

const BarChart = ({ data, label = "Revenue Comparison" }) => {
  const backgroundColors = data.map(() => generateRandomColor());
  const borderColors = backgroundColors.map((color) =>
    color.replace("0.2", "1")
  );

  return (
    <>
      <div className="w-full md:h-full h-96">
        <Bar
          data={{
            labels: data.map((item) => item._id),
            datasets: [
              {
                label: "Revenue by Category",
                data: data.map((item) => item.revenue),
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: label,
              },
            },
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </>
  );
};

const LineChart = ({ data, label = "Revenue Over Time" }) => {
  const revenues = data.map((item) => item.revenue);
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="w-full h-full">
      <Line
        data={{
          labels: sortedData.map((item) =>
            new Date(item.date).toLocaleDateString()
          ),
          datasets: [
            {
              label: label,
              data: revenues,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              tension: 0.2,
              pointRadius: 4,
              pointBackgroundColor: "rgba(75,192,192,1)",
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              text: label,
            },
          },
          responsive: true,

          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

// New BarChart for weekday statistics
const WeekdayBarChart = ({ data, label = "Coupons Sold by Weekday" }) => {
  return (
    <div className="w-full h-full">
      <Bar
        data={{
          labels: data.map((item) => item.day),
          datasets: [
            {
              label: "Coupons Sold",
              data: data.map((item) => item.revenue),
              backgroundColor: data.map(() => generateRandomColor()),
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              text: label,
            },
          },
          responsive: true,

          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

// Function to generate random colors for the charts
const generateRandomColor = () => {
  const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
    Math.random() * 255
  )}, ${Math.floor(Math.random() * 255)}, 0.7)`;
  return randomColor;
};

export default AdminDashboard;
