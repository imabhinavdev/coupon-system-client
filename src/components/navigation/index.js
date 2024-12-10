"use client";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import SiteIcon from "@/components/site-title";
import { UserContext } from "@/context/UserContext";
import { Permissions, SiteLinks } from "@/data";
import { RightArrowIcon } from "@/components/icons";
import Logout from "../logout";
import { usePathname } from "next/navigation";

const NavigationMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, userPermissions } = useContext(UserContext);
  const pathname = usePathname();

  const getNavigationData = () => {
    let data = [
      {
        title: "Dashboard",
        path: "/user/dashboard",
        requiredPermission: Permissions.seeDashboard,
      },
      {
        title: "Coupons",
        path: "/user/coupons",
        requiredPermission: Permissions.seeCoupons,
      },
      {
        title: "Your Orders",
        path: "/user/orders",
        requiredPermission: Permissions.seeOrders,
      },
      {
        title: "History",
        path: "/user/history",
        requiredPermission: Permissions.seeHistory,
      },
      {
        title: "Contact Us",
        path: "/contact",
        requiredPermission: Permissions.seeContact,
      },
    ];

    let manageData = [
      {
        title: "Roles",
        path: "/user/roles",
        requiredPermission: Permissions.manageRoles,
      },
      {
        title: "Permissions",
        path: "/user/permissions",
        requiredPermission: Permissions.managePermissions,
      },
      {
        title: "Coupon Category",
        path: "/user/coupon-category",
        requiredPermission: Permissions.manageCouponCategory,
      },
      {
        title: "Users",
        path: "/user/users",
        requiredPermission: Permissions.manageCouponCategory,
      },
      {
        title: "Scan QR",
        path: "/user/scan-qr",
        requiredPermission: Permissions.scanQr,
      },
    ];

    return {
      main: data.filter(
        (item) =>
          !item.requiredPermission ||
          userPermissions?.includes(item.requiredPermission)
      ),
      manage: manageData.filter(
        (item) =>
          !item.requiredPermission ||
          userPermissions?.includes(item.requiredPermission)
      ),
    };
  };

  const { main: navigationData, manage: manageDropdownData } =
    getNavigationData();

  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!target.closest(".menu-btn") && !target.closest(".dropdown-btn")) {
        setMenuOpen(false);
      }
      if (
        !target.closest(".dropdown-menu") &&
        !target.closest(".dropdown-btn")
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`bg-white pb-2 md:text-sm ${menuOpen ? "shadow-lg rounded-xl border mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0" : ""}`}
    >
      <div className="gap-x-14 items-center mx-auto px-4 md:flex md:px-0">
        <div className="flex items-center justify-between py-5 md:block">
          <SiteIcon />
          <div className="md:hidden">
            <button
              className="menu-btn text-gray-500 hover:text-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6"
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
                  className="w-6 h-6"
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
          className={`flex-1 items-center mt-8 md:mt-0 md:flex ${menuOpen ? "block" : "hidden"}`}
        >
          <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {navigationData.map((item, idx) => (
              <li
                key={idx}
                className={`hover:text-gray-900 ${pathname === item.path ? "text-black font-semibold" : "text-gray-700"}`}
              >
                <Link href={item.path} className="block text-md">
                  {item.title}
                </Link>
              </li>
            ))}
            {manageDropdownData.length > 0 && (
              <li className="relative hover:text-gray-900">
                <button
                  className="dropdown-btn block text-md"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering handleClickOutside
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                  Manage
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu absolute bg-white shadow-md rounded-md mt-2 py-2 w-40 space-y-2 z-10 right-0">
                    {manageDropdownData.map((item, idx) => (
                      <li
                        key={idx}
                        className={`hover:bg-gray-100 ${pathname === item.path ? "text-black font-bold" : "text-gray-700"}`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Link href={item.path} className="block px-4 py-2">
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}
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
                  className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-secondary hover:bg-gray-700 active:bg-gray-900 rounded-lg md:inline-flex"
                >
                  {SiteLinks.signup.title}
                  <RightArrowIcon />
                </Link>
              </>
            ) : (
              <>
                <h1>Hello, {user.name}</h1>
                <Logout className="bg-secondary text-primary rounded-lg p-2 px-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
