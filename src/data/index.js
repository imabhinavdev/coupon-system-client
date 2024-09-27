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
  admin_all_users: {
    title: "All Users",
    link: "/admin/users/all",
  },

  admin_staff_users: {
    title: "Staff Users",
    link: "/admin/users/staff",
  },
  admin_admin_users: {
    title: "Admin Users",
    link: "/admin/users/admins",
  },
};

// export const backendUrl = "http://4.188.68.185:8080/api/v1";
export const backendUrl = "http://localhost:8080/api/v1";

export const backendApi = {
  login: `${backendUrl}/auth/login/`,
  signup: `${backendUrl}/auth/signup/`,
  logout: `${backendUrl}/auth/logout/`,
  coupons: `${backendUrl}/coupon/`,
  active_coupon_category: `${backendUrl}/coupon-category/?isActive=true/`,
  orders: `${backendUrl}/orders/`,
  contact: `${backendUrl}/contact/`,
  verify_coupon: `${backendUrl}/coupon/verify/`,
  who_am_i: `${backendUrl}/auth/whoami/`,
  history: `${backendUrl}/transactions/`,
  other_users: `${backendUrl}/users/?other_users=true/`,
  staff_users: `${backendUrl}/users/?is_staff=true/`,
  admin_users: `${backendUrl}/users/?is_admin=true/`,
  coupon_category: `${backendUrl}/coupon-category/`,
};
