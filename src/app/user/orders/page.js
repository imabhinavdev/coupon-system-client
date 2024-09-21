import React from "react";

const Orders = () => {
  const orders = [
    {
      id: 1,
      title: "Order 1",
      price: 1000,
    },
    {
      id: 2,
      title: "Order 2",
      price: 2000,
    },
  ]; // Assuming no orders exist for now. Replace with actual data if needed.

  return (
    <div className="flex-grow h-full flex items-start justify-center bg-secondary rounded-xl">
      {orders.length > 0 ? (
        <div className="w-full mx-auto p-4">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">
            Your Orders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-primary text-secondary p-6 rounded-xl shadow-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{order.title}</h3>
                  <span className="text-sm text-gray-400">21-08-2024</span>

                  <p className="mt-2">₹{order.price}</p>
                </div>
                <button className="bg-secondary text-primary px-4 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">
            No Orders Yet
          </h2>
          <p className="text-xl text-primary">
            Looks like you haven't placed any orders yet. Start shopping now!
          </p>
          <button className="mt-6 bg-primary text-secondary px-6 py-3 rounded-lg">
            Explore Coupons
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
