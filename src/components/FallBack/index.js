"use client";
import { useEffect, useState } from "react";

const FallbackComponent = () => {
  const [time, setTime] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (time === 1) {
        window.location.href = "/";
      }
      setTime(time - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

  return (
    <div className="flex items-center justify-center h-screen bg-red-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Something went wrong!
        </h1>
        <p className="mt-4">
          You will be redirected to the homepage in {time} seconds.
        </p>
      </div>
    </div>
  );
};

export default FallbackComponent;
