import React from "react";
import Link from "next/link";
const SiteIcon = ({ className }) => {
  return (
    <Link href="/" className={`text-2xl font-bold ${className}`}>
      Coupon System
    </Link>
  );
};

export default SiteIcon;
