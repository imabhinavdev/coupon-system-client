"use client";
import { EyeCloseIcon, EyeOpenIcon, GoogleIcon } from "@/components/icons";
import SiteIcon from "@/components/site-title";
import { SiteLinks } from "@/data";
import { toast } from "react-toastify";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("student"); // state to track if user is Student or Faculty
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const enrollmentRef = useRef(null);
  const phoneRef = useRef(null);
  const nameRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const enrollment = enrollmentRef.current?.value;
    const phone = phoneRef.current.value;
    const name = nameRef.current.value;

    if (!email || !password || !phone || !name) {
      toast.error("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);

    if (userType === "student") {
      formData.append("enrollment", enrollment);
    }

    const saveUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/auth/signup", {
          method: "POST",
          credentials: "include",

          body: formData, // No need to set 'Content-Type'
        });
        const data = await res.json();
        if (res.ok) {
          toast.success("Account created successfully");
          router.push(SiteLinks.coupons.link);
        } else {
          toast.error(data.error || "An error occurred. Please try again");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred. Please try again");
      }
    };
    saveUser();
  };

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 md:py-8 sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <SiteIcon />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Create an account
            </h3>
            <p>
              Already have an account?{" "}
              <Link
                href={SiteLinks.login.link}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="font-medium">Full Name</label>
              <input
                type="text"
                required
                ref={nameRef}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium">User Type</label>
              <div className="mt-2 flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="student"
                    checked={userType === "student"}
                    onChange={() => setUserType("student")}
                    className="mr-2"
                  />
                  Student
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="faculty"
                    checked={userType === "faculty"}
                    onChange={() => setUserType("faculty")}
                    className="mr-2"
                  />
                  Faculty
                </label>
              </div>
            </div>

            {userType === "student" && (
              <div>
                <label className="font-medium">Enrollment</label>
                <input
                  type="text"
                  ref={enrollmentRef}
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="font-medium">Phone Number</label>
              <input
                type="tel"
                required
                ref={phoneRef}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
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
                minLength="8"
                ref={passwordRef}
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
              className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
            >
              Create account
            </button>
          </form>
          <div className="mt-5">
            <button className="w-full flex items-center justify-center gap-x-3 py-2.5 mt-5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100">
              <GoogleIcon className="h-5 w-5" />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
