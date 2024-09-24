export const NavigationData = [
  { title: "Coupons", path: "/user/coupons" },
  { title: "Contact Us", path: "/contact" },
  { title: "Your Orders", path: "/user/orders" },
];

export const SiteLinks = {
  login: {
    title: "Login",
    link: "/auth/login",
  },
  signup: {
    title: "Signup",
    link: "/auth/signup",
  },
  coupons: {
    title: "Explore Coupons",
    link: "/user/coupons",
  },
};

export const backendUrl = "http://4.188.68.185:8080/api/v1";

export const backendApi = {
  login: `${backendUrl}/auth/login`,
  signup: `${backendUrl}/auth/signup`,
  coupons: `${backendUrl}/coupon`,
  active_coupon_category: `${backendUrl}/coupon-category/?isActive=true`,
  orders: `${backendUrl}/orders`,
  contact: `${backendUrl}/contact`,
  verify_coupon: `${backendUrl}/coupon/verify`,
};
