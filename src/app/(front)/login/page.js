"use client";
import { EyeCloseIcon, EyeOpenIcon, GoogleIcon } from "@/components/icons";
import SiteIcon from "@/components/site-title";
import { NavigationButtonData } from "@/data";
import React, { useState } from "react";
import Link from "next/link";

export default () => {
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleEmailVisibility = () => {
    setShowEmail(!showEmail);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 rounded sm:px-4">
      <div className="w-full space-y-6 sm:max-w-md">
        <div className="text-center">
          <SiteIcon />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
            <p>
              Don't have an account?{" "}
              <Link
                href={NavigationButtonData.signup.link}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 space-y-8 sm:p-6 sm:rounded-lg">
          <div>
            <button className="flex items-center justify-center py-2.5 w-full border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100">
              <GoogleIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <span className="block w-full h-px bg-gray-300"></span>
            <p className="inline-block w-fit text-sm bg-white px-2 absolute -top-2 inset-x-0 mx-auto">
              Or continue with
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <label className="font-medium">Email</label>
              <input
                type={showEmail ? "text" : "email"}
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
              <span
                onClick={toggleEmailVisibility}
                className="absolute right-3 top-10 cursor-pointer"
              >
                {showEmail ? <EyeOpenIcon /> : <EyeCloseIcon />}
              </span>
            </div>
            {/* Password Input */}
            <div className="relative">
              <label className="font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
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
            <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
              Sign in
            </button>
          </form>
        </div>
        <div className="text-center">
          <a href="javascript:void(0)" className="hover:text-indigo-600">
            Forgot password?
          </a>
        </div>
      </div>
    </main>
  );
};
