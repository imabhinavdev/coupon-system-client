"use client";
import SiteIcon from "@/components/site-title";
import { SiteLinks } from "@/data";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { backendApi } from "@/data";
import { LoadingIcon, EyeCloseIcon, EyeOpenIcon } from "@/components/icons";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const passwordRef = useRef(null);
  const otpRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hanldeSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(backendApi.forgot_password_email, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setOtpSent(true);
      } else {
        throw new Error(data);
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    const otp = otpRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await fetch(backendApi.reset_password, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push(SiteLinks.login.link);
      } else {
        throw new Error(data);
      }
    } catch (error) {
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 md:py-8 rounded sm:px-4">
      <div className="w-full space-y-6 sm:max-w-md">
        <div className="text-center">
          <SiteIcon />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Forgot Password
            </h3>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
          {!otpSent ? (
            <>
              <form onSubmit={hanldeSubmit} className="space-y-5">
                <div className="relative">
                  <label className="font-medium">Email</label>
                  <input
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>

                <button
                  type="password"
                  disabled={loading}
                  className={`w-full disabled:bg-indigo-300 flex justify-center items-center px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 `}
                >
                  Send OTP
                  {loading && <LoadingIcon color="#fff" className="w-6 h-6" />}
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-center text-red-500">
                OTP sent to your email. Please check your email and enter the
                OTP below.
              </p>
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div className="relative">
                  <label className="font-medium">OTP</label>
                  <input
                    type="text"
                    required
                    ref={otpRef}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
                <div className="relative">
                  <label className="font-medium">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    ref={passwordRef}
                    minLength={8}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-10 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOpenIcon className="h-6 w-6" />
                    ) : (
                      <EyeCloseIcon className="h-6 w-6" />
                    )}
                  </span>
                </div>

                <button
                  type="submit"
                  className={`w-full disabled:bg-indigo-300 flex justify-center items-center px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 `}
                >
                  Reset Password
                  {loading && <LoadingIcon color="#fff" className="w-6 h-6" />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
