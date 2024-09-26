import React from "react";
import DashboardCard from "@/components/dashboard-card";
import { SiteLinks } from "@/data";

const ManageUsersPage = () => {
  const userCardsData = [
    {
      title: "Manage Student Users",
      description: "View, edit, and manage all student users in the system.",
      buttonLabel: "Manage Students",
      buttonColor: "bg-blue-500",
      link: SiteLinks.admin_all_users.link,
    },
    {
      title: "Manage Staff Users",
      description: "View, edit, and manage all staff users in the system.",
      buttonLabel: "Manage Staff",
      buttonColor: "bg-green-500",
      link: SiteLinks.admin_staff_users.link,
    },
    {
      title: "Manage Admin Users",
      description: "View, edit, and manage all admin users in the system.",
      buttonLabel: "Manage Admins",
      buttonColor: "bg-red-500",
      link: SiteLinks.admin_admin_users.link,
    },
  ];

  return (
    <div className="container ">
      <h1 className="text-2xl font-bold text-center mb-8">Manage Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userCardsData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            description={card.description}
            buttonLabel={card.buttonLabel}
            buttonColor={card.buttonColor}
            link={card.link}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageUsersPage;
