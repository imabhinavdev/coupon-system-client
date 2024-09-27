"use client";
import React, { useState, useEffect } from "react";
import { Chart, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { backendApi } from "@/data";
import { toast } from "react-toastify";

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 18; // Increase title font size
defaults.plugins.title.color = "black";

const AdminDashboard = () => {
  const [revenueByCategory, setRevenueByCategory] = useState(null);
  const [revenueOverTime, setRevenueOverTime] = useState(null);
  const [transactionsByWeekday, setTransactionsByWeekday] = useState(null);
  const [couponStatsByWeekday, setCouponStatsByWeekday] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(null);

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
        console.log(data.coupon_stats_by_weekday);
        // Process data to store it in couponStatsByWeekday
        const statsByWeekday = [
          { day: "Monday", ...data.coupon_stats_by_weekday.Monday },
          { day: "Tuesday", ...data.coupon_stats_by_weekday.Tuesday },
          { day: "Wednesday", ...data.coupon_stats_by_weekday.Wednesday },
          { day: "Thursday", ...data.coupon_stats_by_weekday.Thursday },
          { day: "Friday", ...data.coupon_stats_by_weekday.Friday },
          { day: "Saturday", ...data.coupon_stats_by_weekday.Saturday },
          { day: "Sunday", ...data.coupon_stats_by_weekday.Sunday },
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
      <div className="text-3xl font-semibold mb-2">Admin Dashboard</div>
      <h1 className="text-2xl font-semibold mb-4">
        Total Revenue:{" "}
        <span className="text-green-600 p-2 rounded-lg shadow-md border border-gray-100 ">
          ₹ {totalRevenue}
        </span>
      </h1>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
        {revenueByCategory && (
          <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg w-full h-[400px]">
            <DoughnutChart data={revenueByCategory} />
          </div>
        )}
        {revenueByCategory && (
          <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg w-full h-[400px]">
            <BarChart data={revenueByCategory} />
          </div>
        )}
        {revenueOverTime && (
          <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg w-full h-[400px]">
            <LineChart data={revenueOverTime} />
          </div>
        )}
        {couponStatsByWeekday && ( // New BarChart for weekdays
          <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-lg w-full h-[400px]">
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
    <div className="w-full h-full">
      <Doughnut
        data={{
          labels: data.map((item) => item.category),
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
    <div className="w-full h-full">
      <Bar
        data={{
          labels: data.map((item) => item.category),
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
              data: data.map((item) => item.coupons_sold),
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
