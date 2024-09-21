import React from "react";

const Coupons = () => {
  return (
    <>
      <div className="grid md:grid-cols-3 grid-cols-1 md:p-0 gap-8">
        {coupons.map((coupon) => (
          <div
            className="bg-secondary flex justify-between items-center text-primary rounded-xl px-12 py-4"
            key={coupon.id}
          >
            <div>
              <h3 className="md:text-2xl text-md">{coupon.title}</h3>
              <p>₹{coupon.price}</p>
            </div>
            <button className="bg-primary text-secondary text-sm md:text-md rounded-lg px-4 py-2">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Coupons;

const coupons = [
  {
    id: 1,
    title: "Mess Coupon",
    price: 80,
  },
  {
    id: 2,
    title: "Cateen Coupon",
    price: 20,
  },
  {
    id: 3,
    title: "SIH Coupon",
    price: 100,
  },
];
