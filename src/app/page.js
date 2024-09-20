'use client'
import GenerateQR from '@/components/qrcode-generate';
import React, { useState } from 'react';

const Page = () => {
  const [coupon, setCoupon] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault(); // Prevent default form submit behavior

    const formData = new FormData();
    formData.append('id', '3');
    formData.append('user_id', '1');

    try {
      const response = await fetch('http://localhost:8080/api/v1/payment/order', {
        method: 'POST',
        body: formData, // Send the formData directly
      });

      const data = await response.json();
      console.log(data);
      const orderID = data.data.id;
      const transactionId = data.data.transaction_id;

      var options = {
        "key": "rzp_test_FivlgkZZzZspfT", // Enter the Key ID generated from the Dashboard
        "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Ikshana",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": orderID, // Order ID from your server response
        "handler": function (response) {
          // Log all values returned in the response
          verifySignature(response.razorpay_signature, transactionId, response.razorpay_payment_id, response.razorpay_order_id);


        },
        "prefill": {
          "name": "Abhinav Singh",
          "email": "contact@imabhinav.dev",
          "contact": "9000090000"
        },
        "notes": {
          "address": "Razorpay Corporate Office"
        },
        "theme": {
          "color": "#3399cc"
        }
      };

      var rzp1 = new Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert(`Payment failed! Error Code: ${response.error.code}`);
        alert(`Description: ${response.error.description}`);
        alert(`Source: ${response.error.source}`);
        alert(`Step: ${response.error.step}`);
        alert(`Reason: ${response.error.reason}`);
        alert(`Order ID: ${response.error.metadata.order_id}`);
        alert(`Payment ID: ${response.error.metadata.payment_id}`);
      });

      rzp1.open(); // Trigger the payment
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  const verifySignature = async (razorpay_signature, transaction_id, razorpay_payment_id, razorpay_order_id) => {

    const formData = new FormData();
    formData.append('razorpay_signature', razorpay_signature);
    formData.append('transaction_id', transaction_id);
    formData.append('razorpay_payment_id', razorpay_payment_id);
    formData.append('razorpay_order_id', razorpay_order_id);

    try {
      const response = await fetch('http://localhost:8080/api/v1/payment/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.dir(data);
      const couponData = {};
      couponData["coupon_category"] = data.data.coupon_category_name;
      couponData["id"] = data.data.id;
      couponData["user_id"] = data.data.user_id;
      console.dir(couponData);
      setCoupon(couponData);
    } catch (error) {
      console.error('Error during payment:', error);
    }


  }


  return (
    <div>
      <h1>Testing Payment</h1>
      <button className='p-2 bg-slate-200 rounded' onClick={handlePayment}>
        Pay
      </button>
      {coupon && (
        <GenerateQR coupon={coupon} />
      )}
    </div>
  );
};

export default Page;
