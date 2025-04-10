"use client";
import {
  EyeCloseIcon,
  EyeOpenIcon,
  GoogleIcon,
  LoadingIcon,
} from "@/components/icons";
import SiteIcon from "@/components/site-title";
import { backendApi, SiteLinks } from "@/data";
import { toast } from "react-toastify";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("user");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const enrollmentRef = useRef(null);
  const phoneRef = useRef(null);
  const nameRef = useRef(null);
  const otpRef = useRef(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmPasswordChange = () => {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    const enrollment = enrollmentRef.current?.value;
    const phone = phoneRef.current.value;
    const name = nameRef.current.value;
    const role = userType;

    if (!email || !password || !phone || !name) {
      toast.error("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const dataToSend = {
      email,
      password,
      phone,
      name,
      enrollment,
      role,
    };

    const saveUser = async () => {
      try {
        const res = await fetch(backendApi.signup, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message);
          setLoading(false);
          setOtpSent(true);
        } else {
          toast.error(data.error || "An error occurred. Please try again");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again");
      } finally {
        setLoading(false);
      }
    };

    saveUser();
  };

  const handleVerify = (e) => {
    setLoading(true);
    e.preventDefault();
    const otp = otpRef.current.value;

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    const verifyOtp = async () => {
      try {
        const res = await fetch(backendApi.verify_account, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp, email }),
        });
        const data = await res.json();
        if (res.ok) {
          toast.success(data.message);
          window.location.reload();
        } else {
          toast.error(data.error || "An error occurred. Please try again");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again");
      } finally {
        setLoading(false);
      }
    };
    verifyOtp();
  };

  return (
    <main className="w-full flex flex-col items-center justify-center bg-gray-50 md:py-8 sm:px-4">
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        {!otpSent ? (
          <>
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
                        value="user"
                        checked={userType === "user"}
                        onChange={() => setUserType("user")}
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

                {userType === "user" && (
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
                    onChange={(e) => setEmail(e.target.value)}
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

                <div className="relative">
                  <label className="font-medium">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength="8"
                    ref={confirmPasswordRef}
                    onChange={handleConfirmPasswordChange}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-10 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOpenIcon className="h-6 w-6" />
                    ) : (
                      <EyeCloseIcon className="h-6 w-6" />
                    )}
                  </span>
                  {passwordMatchError && (
                    <p className="text-red-600 text-sm mt-2">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full disabled:bg-indigo-300 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                >
                  Create account
                  {loading && <LoadingIcon color="#fff" className="w-6 h-6" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Verify OTP
              </h3>
              <p className="mt-2 text-sm">
                An OTP has been sent to your email. Please enter it below.
              </p>
            </div>
            <div className="bg-white shadow p-4 py-6 sm:p-6 sm:rounded-lg">
              <form className="space-y-5" onSubmit={handleVerify}>
                <div>
                  <label className="font-medium">OTP</label>
                  <input
                    type="text"
                    required
                    ref={otpRef}
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full disabled:bg-indigo-300 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                >
                  Verify OTP
                  {loading && <LoadingIcon color="#fff" className="w-6 h-6" />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Signup;
