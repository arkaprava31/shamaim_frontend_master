

import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import CheckoutForm from "./CheckoutForm";

export default function RazorpayCheckout() {
  const [orderId, setOrderId] = useState("");
  const currentOrder = useSelector();

  useEffect(() => {
    // Create an order using Razorpay API
    createOrder();
  }, []);

  const createOrder = async () => {
    try {
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: currentOrder.totalAmount, currency: 'INR' }),
        // res.send({ amount: currentOrder.totalAmount, currency: 'INR' }),
      });
      const data = await response.json();
      setOrderId(data.orderId);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handlePayment = () => {
    // Initialize Razorpay with your options and order ID
    const options = {
      key: 'YOUR_RAZORPAY_KEY',
      amount: currentOrder.totalAmount * 100, // Amount should be in paisa
      currency: 'INR',
      order_id: orderId,
      handler: function(response) {
        // Handle successful payment
        alert(response.razorpay_payment_id);
      },
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#F37254'
      }
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="Razorpay">
      {orderId && (
        <CheckoutForm handlePayment={handlePayment} />
      )}
    </div>
  );
}

