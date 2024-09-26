import Link from "next/link";
import React from "react";

const DashboardCard = ({
  title,
  description,
  buttonLabel,
  buttonColor,
  link = "",
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 text-center">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={link}
        className={`text-white py-2 px-4 rounded hover:bg-opacity-75 ${buttonColor}`}
      >
        {buttonLabel}
      </Link>
    </div>
  );
};

export default DashboardCard;
