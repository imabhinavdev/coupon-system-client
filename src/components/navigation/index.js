"use client";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import SiteIcon from "@/components/site-title";
import { UserContext } from "@/context/UserContext";
import { SiteLinks } from "@/data";
import { RightArrowIcon } from "@/components/icons";
import Logout from "../logout";

const NavigationMenu = () => {
  const [state, setState] = useState(false);
  const { user } = useContext(UserContext);

  // Define navigation data based on user role
  const getNavigationData = () => {
    if (user?.is_admin) {
      return [
        { title: "Dashboard", path: "/admin/dashboard" },
        { title: "Manage Users", path: "/admin/users" },
        { title: "Coupon Category", path: "/admin/coupon-category" },
      ];
    } else if (user?.is_staff) {
      return [
        { title: "Coupons", path: "/staff/coupons" },
        { title: "Orders", path: "/staff/orders" },
        { title: "History", path: "/staff/history" },
      ];
    } else {
      return [
        { title: "Coupons", path: "/user/coupons" },
        { title: "Your Orders", path: "/user/orders" },
        { title: "History", path: "/user/history" },
        { title: "Contact Us", path: "/contact" },
      ];
    }
  };

  const navigationData = getNavigationData();

  useEffect(() => {
    document.onclick = (e) => {
      const target = e.target;
      if (!target.closest(".menu-btn")) setState(false);
    };
  }, []);

  return (
    <nav
      className={`bg-white pb-5 md:text-sm ${
        state
          ? "shadow-lg rounded-xl border mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0"
          : ""
      }`}
    >
      <div className="gap-x-14 items-center mx-auto px-4 md:flex md:px-0">
        <div className="flex items-center justify-between py-5 md:block">
          <SiteIcon />
          <div className="md:hidden">
            <button
              className="menu-btn text-gray-500 hover:text-gray-800"
              onClick={() => setState(!state)}
            >
              {state ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-6 h-6`}
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={` w-6 h-6`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className={`flex-1 items-center mt-8 md:mt-0 md:flex ${
            state ? "block" : "hidden"
          } `}
        >
          <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {navigationData.map((item, idx) => (
              <li key={idx} className="text-gray-700 hover:text-gray-900">
                <Link href={item.path} className="block text-md">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
            {!user ? (
              <>
                <Link
                  href={SiteLinks.login.link}
                  className="block text-gray-700 hover:text-gray-900 text-md"
                >
                  {SiteLinks.login.title}
                </Link>
                <Link
                  href={SiteLinks.signup.link}
                  className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-secondary hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
                >
                  {SiteLinks.signup.title}
                  <RightArrowIcon />
                </Link>
              </>
            ) : (
              <>
                <h1>Hello, {user.name}</h1>
                <Logout className="bg-secondary text-primary rounded-full p-2 px-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
