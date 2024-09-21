"use client";
import React, { useEffect } from "react";

const Page = () => {


  return (
    <div className="md:py-10 p-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to the College Coupon System
        </h1>
        <p className="text-xl mb-6">
          Unlock exclusive discounts and deals with your college coupons.
        </p>

        <div className="flex justify-center mb-6">
          <img
            className="w-2/3 md:w-1/3 rounded-lg shadow-lg"
            src="/mess-coupon.png"
            alt="Coupons"
          />
        </div>

        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out">
          Get Started
        </button>

        <div className="mt-8 flex flex-col md:gap-4 md:flex-row justify-around">
          <div className="bg-white text-purple-600 p-6 rounded-lg shadow-lg mb-4 md:mb-0">
            <h3 className="text-2xl font-semibold mb-2">Easy to Use</h3>
            <p>Simply scan and redeem your coupons online or in-store.</p>
          </div>
          <div className="bg-white text-pink-600 p-6 rounded-lg shadow-lg mb-4 md:mb-0">
            <h3 className="text-2xl font-semibold mb-2">Exclusive Offers</h3>
            <p>Enjoy special discounts just for college students.</p>
          </div>
          <div className="bg-white text-red-600 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-2">Track Savings</h3>
            <p>Monitor how much you've saved using our system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
