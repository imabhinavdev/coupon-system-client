"use client";
import { EyeCloseIcon, EyeOpenIcon, GoogleIcon, LoadingIcon } from "@/components/icons";
import SiteIcon from "@/components/site-title";
import { SiteLinks } from "@/data";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { backendApi } from "@/data";
const LoginPage = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      if (!email || !password) {
        toast.error("Please fill all the fields");
        return;
      }

      const res = await fetch(backendApi.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Logged in successfully");
        setLoading(false);
        console.log(data);
        window.location.reload();
      } else {
        toast.error(data.error || "An error occurred. Please try again");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 md:py-8 rounded sm:px-4">
      <div className="w-full space-y-6 sm:max-w-md">
        <div className="text-center">
          <SiteIcon />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href={SiteLinks.signup.link}
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label className="font-medium">Email</label>
              <input
                type={showEmail ? "text" : "email"}
                required
                ref={emailRef}
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
              type="password"
              className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                onClick={()=>setLoading(true)}
            >
              {
                loading ? (
                  <div className="flex justify-center">
                    <LoadingIcon className="w-6 h-6" color="#FFF"/>
                  </div>
                ) : (
                  "Log in"
                )
              }
            </button>
          </form>
        </div>
        <div className="text-center">
          <Link
            href={SiteLinks.forgot_password.link}
            className="hover:text-indigo-600"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
