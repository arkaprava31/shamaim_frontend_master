import { useContext, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { resetCartAsync } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";
import { resetOrder } from "../features/order/orderSlice";
import { getGuestUserId, getId } from "../app/constants";
import { AppContext } from "../app/Context";
import { get } from "react-hook-form";
import { useState } from "react";

function OrderSuccessPage() {
  const params = useParams()
  const dispatch = useDispatch();

  const { logout, updateCart, handleLoggedInOrGuest } = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(() => {
    // reset cart
    dispatch(resetCartAsync())
    // reset currentOrder
    dispatch(resetOrder())
  }, [dispatch]);

  useEffect(() => {
    updateCart();
  }, [])

  const [copied, setCopied] = useState(false);

  const orderId = params?.id;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHome = async () => {
    if (getGuestUserId()) {
      await logout();
      handleLoggedInOrGuest();
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {!params.id && <Navigate to='/' replace={true}></Navigate>}
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-8 text-center">

          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            Order Placed Successfully 🎉
          </h1>

          <p className="mt-2 text-gray-600">
            Thank you for shopping with <span className="font-medium">Shamaim Lifestyle</span>
          </p>

          {/* Order ID Box */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-500">Your Order ID</p>
            <p className="mt-1 break-all font-mono text-xl font-semibold text-gray-900">
              #{orderId}
            </p>

            <button
              onClick={handleCopy}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              {copied ? "Copied ✔" : "Copy Order ID"}
            </button>
          </div>

          {/* Logged-in user note */}
          {!getGuestUserId() && getId() && (
            <p className="mt-6 text-sm text-gray-600">
              You can track your order in
              <span className="font-medium"> My Orders</span>
            </p>
          )}

          {getGuestUserId() && !getId() && (
            <p className="mt-6 text-sm text-gray-700 italic">
              *Kindly keep your Order ID for future reference or any order-related queries.
            </p>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleHome}
              className="rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              Go back home
            </button>

            {!getGuestUserId() && getId() && (
              <button
                onClick={() => navigate("/my-orders")}
                className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                View My Orders
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default OrderSuccessPage;
