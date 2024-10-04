import React from "react";

const Footer = () => {
  return (
    <div className="w-full p-3 bg-gray-800 flex justify-center rounded-t-md">
      <p className="text-primary text-center">
        {" "}
        Mady with ❤ by{" "}
        <a href="https://imyash.dev" className="no-underline text-blue-400">
          Yash Soni
        </a>{" "}
        &{" "}
        <a href="https://imabhinav.dev" className="no-underline text-blue-400">
          Abhinav Singh
        </a>{" "}
        | Copyright &#169; Coupon System
      </p>
    </div>
  );
};

export default Footer;
