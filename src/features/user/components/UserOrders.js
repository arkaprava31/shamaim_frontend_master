import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  fetchLoggedInUserOrderAsync,
} from '../userSlice';
import { GrNext } from "react-icons/gr";
import { Link } from 'react-router-dom';

export default function UserOrders() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await dispatch(fetchLoggedInUserOrderAsync()).unwrap();
    setOrders(res);
  };

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-6 mt-6 lg:mt-0">
        <h1 className="text-4xl font-semibold text-gray-900">My Orders</h1>
        <p className="text-base text-indigo-600 mt-1">
          Your recent purchases & order history
        </p>
      </div>

      {/* Orders */}
      {orders && orders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              to={`/orders-details/${order.id}`}
              key={order.id}
              className="group bg-white rounded-2xl border border-indigo-100 p-4 sm:p-5 flex items-center gap-4
                         hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
            >
              {/* Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={order.items[0].thumbnail}
                  alt={order.items[0].name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-200"
                />
                {/* Status Dot (placeholder) */}
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
              </div>

              {/* Order Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">
                  Ordered on {formatDate(order.createdAt)}
                </p>

                <p className="mt-1 text-sm sm:text-base font-semibold text-indigo-700 truncate">
                  Order #{order.id}
                </p>

                <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                  {order.items[0].name}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center text-indigo-400 group-hover:text-indigo-600 transition">
                <GrNext size={18} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-indigo-100 p-10 text-center shadow-sm">
          <p className="text-gray-700 text-lg font-medium">
            No orders yet
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Looks like you haven’t placed any orders
          </p>

          <Link
            to="/"
            className="inline-block mt-5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600
                       px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}