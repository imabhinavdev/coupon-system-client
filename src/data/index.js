import { update } from "lodash";

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
  manage_single_user: {
    title: "Manage User",
    link: "/admin/users/manage",
  },

  admin_staff_users: {
    title: "Staff Users",
    link: "/admin/users/staff",
  },
  admin_admin_users: {
    title: "Admin Users",
    link: "/admin/users/admins",
  },
  forgot_password: {
    title: "Forgot Password",
    link: "/auth/forgot-password",
  },
};

// export const backendUrl = "http://4.188.68.185:8080/api/v1";
export const backendUrl = "/api";
// export const backendUrl = "http://192.168.0.6:8080/api/v1";

export const backendApi = {
  login: `${backendUrl}/auth/login/`,
  signup: `${backendUrl}/auth/signup/`,
  verify_account: `${backendUrl}/auth/verify/`,
  logout: `${backendUrl}/auth/logout/`,
  coupons: `${backendUrl}/coupon/`,
  active_coupon_category: `${backendUrl}/coupon-category/?isActive=true`,
  edit_coupon_category: `${backendUrl}/coupon-category/`,
  orders: `${backendUrl}/orders/`,
  contact: `${backendUrl}/contact/`,
  verify_coupon: `${backendUrl}/coupon/verify/`,
  who_am_i: `${backendUrl}/auth/whoami/`,
  history: `${backendUrl}/transactions/`,
  other_users: `${backendUrl}/users/?otherUsers=true/`,
  staff_users: `${backendUrl}/users/?isStaff=true/`,
  admin_users: `${backendUrl}/users/?isAdmin=true/`,
  search_users: `${backendUrl}/users/?search=`,
  coupon_category: `${backendUrl}/coupon-category/`,
  revenue_by_category: `${backendUrl}/transactions/revenue/by-category/`,
  revenue_over_time: `${backendUrl}/transactions/revenue/stats/`,
  revenue_by_weekday: `${backendUrl}/coupon/used-by-weekdays/`,
  total_revenue: `${backendUrl}/transactions/revenue/`,
  all_details_of_user: `${backendUrl}/users/all-details`,
  update_user: `${backendUrl}/users/`,
  forgot_password_email: `${backendUrl}/auth/forgot-password/`,
  reset_password: `${backendUrl}/auth/reset-password/`,
  assign_coupon: `${backendUrl}/coupon/assign-coupon/`,
};
