"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Chart, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { backendApi } from "@/data";
import { toast } from "react-toastify";
import { LoadingIcon } from "@/components/icons";

defaults.aspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 18;
defaults.plugins.title.color = "black";

const AdminDashboard = () => {
  const [reportLoading, setReportLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    revenueByCategory: [],
    revenueOverTime: [],
    couponStatsByWeekday: [],
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const fetchDashboardData = async () => {
    try {
      const [
        revenueByCategoryRes,
        totalRevenueRes,
        revenueOverTimeRes,
        couponStatsRes,
      ] = await Promise.all([
        fetch(backendApi.revenue_by_category),
        fetch(backendApi.total_revenue),
        fetch(backendApi.revenue_over_time),
        fetch(backendApi.revenue_by_weekday),
      ]);

      const [
        revenueByCategoryData,
        totalRevenueData,
        revenueOverTimeData,
        couponStatsData,
      ] = await Promise.all([
        revenueByCategoryRes.json(),
        totalRevenueRes.json(),
        revenueOverTimeRes.json(),
        couponStatsRes.json(),
      ]);

      if (
        revenueByCategoryRes.ok &&
        totalRevenueRes.ok &&
        revenueOverTimeRes.ok &&
        couponStatsRes.ok
      ) {
        const statsByWeekday = [
          { day: "Sunday", ...couponStatsData.coupon_stats_by_weekday["1"] },
          { day: "Monday", ...couponStatsData.coupon_stats_by_weekday["2"] },
          { day: "Tuesday", ...couponStatsData.coupon_stats_by_weekday["3"] },
          { day: "Wednesday", ...couponStatsData.coupon_stats_by_weekday["4"] },
          { day: "Thursday", ...couponStatsData.coupon_stats_by_weekday["5"] },
          { day: "Friday", ...couponStatsData.coupon_stats_by_weekday["6"] },
          { day: "Saturday", ...couponStatsData.coupon_stats_by_weekday["7"] },
        ];

        setDashboardData({
          revenueByCategory: revenueByCategoryData.revenue_by_category,
          totalRevenue: totalRevenueData.total_revenue,
          revenueOverTime: revenueOverTimeData.revenue,
          couponStatsByWeekday: statsByWeekday,
        });
      } else {
        throw new Error("Failed to fetch some dashboard data");
      }
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const memoizedDoughnutChart = useMemo(
    () => <DoughnutChart data={dashboardData.revenueByCategory} />,
    [dashboardData.revenueByCategory],
  );
  const memoizedBarChart = useMemo(
    () => <BarChart data={dashboardData.revenueByCategory} />,
    [dashboardData.revenueByCategory],
  );
  const memoizedLineChart = useMemo(
    () => <LineChart data={dashboardData.revenueOverTime} />,
    [dashboardData.revenueOverTime],
  );
  const memoizedWeekdayBarChart = useMemo(
    () => <WeekdayBarChart data={dashboardData.couponStatsByWeekday} />,
    [dashboardData.couponStatsByWeekday],
  );

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingIcon className="w-6 h-6" />
      </div>
    );
  }

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const response = await fetch(backendApi.generate_report, {
        method: "GET",
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "report.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.error("Failed to download report");
      }
    } catch (error) {
      console.error("Failed to download report", error);
      toast.error("Failed to download report");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <>
      <div className="text-3xl font-semibold mb-2 flex flex-col md:flex-row gap-5 md:gap-0 justify-between">
        <div className="flex flex-col">
          <h1>Dashboard</h1>
          <button
            disabled={reportLoading}
            onClick={handleGenerateReport}
            className="text-sm flex gap-2 justify-center bg-secondary rounded p-2 text-primary disabled:bg-gray-800 "
          >
            Generate Report
            {reportLoading && (
              <LoadingIcon color="#fff" className="animate-spin h-5 w-5 ml-2" />
            )}
          </button>
        </div>
        <h1 className="text-2xl font-semibold mb-4">
          Total Revenue:{" "}
          <span className="text-blue-700 p-2 font-black text-3xl md:text-5xl rounded-lg shadow-md border border-gray-100">
            ₹ {dashboardData?.totalRevenue}
          </span>
        </h1>
      </div>

      <div className="mb-4 border-b border-gray-200  overflow-x-auto overflow-y-hidden">
        <ul
          className="flex flex-nowrap -mb-px text-sm font-medium text-center"
          role="tablist"
        >
          <TabButton
            label="Revenue Distribution"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="profile"
          />
          <TabButton
            label="Revenue Comparison"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="dashboard"
          />
          <TabButton
            label="Revenue Over Time"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="settings"
          />
          <TabButton
            label="Coupons Sold"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabName="contacts"
          />
        </ul>
      </div>

      <div id="default-tab-content">
        {activeTab === "profile" && (
          <div className="p-4 rounded-lg md:h-[60vh] w-full bg-gray-50">
            {memoizedDoughnutChart}
          </div>
        )}
        {activeTab === "dashboard" && (
          <div className="p-4 rounded-lg md:h-[60vh] bg-gray-50">
            {memoizedBarChart}
          </div>
        )}
        {activeTab === "settings" && (
          <div className="p-4 rounded-lg md:h-[60vh] bg-gray-50">
            {memoizedLineChart}
          </div>
        )}
        {activeTab === "contacts" && (
          <div className="p-4 rounded-lg md:h-[60vh] bg-gray-50">
            {memoizedWeekdayBarChart}
          </div>
        )}
      </div>
    </>
  );
};

const TabButton = ({ label, activeTab, setActiveTab, tabName }) => (
  <li className="mr-2" role="presentation">
    <button
      className={`inline-block p-4 border-b-2 rounded-t-lg ${
        activeTab === tabName ? "border-blue-600 text-blue-600" : ""
      }`}
      onClick={() => setActiveTab(tabName)}
    >
      {label}
    </button>
  </li>
);

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
    color.replace("0.2", "1"),
  );

  return (
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
  );
};

const LineChart = ({ data, label = "Revenue Over Time" }) => {
  const revenues = data.map((item) => item.revenue);
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="w-full md:h-full h-96 flex justify-center">
      <Line
        data={{
          labels: sortedData.map((item) =>
            new Date(item.date).toLocaleDateString(),
          ),
          datasets: [
            {
              label: label,
              data: revenues,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
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

const WeekdayBarChart = ({ data, label = "Coupons Sold by Day" }) => {
  const backgroundColors = data.map(() => generateRandomColor());
  const borderColors = backgroundColors.map((color) =>
    color.replace("0.2", "1"),
  );

  return (
    <div className="w-full md:h-full h-96 flex justify-center">
      <Bar
        data={{
          labels: data.map((item) => item.day),
          datasets: [
            {
              label: label,
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
  );
};

const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return `rgba(${r}, ${g}, ${b}, 0.6)`;
};

export default AdminDashboard;
