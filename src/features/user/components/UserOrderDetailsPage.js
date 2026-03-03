import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchorderbyidAsync, fetchproductorderbyidAsync, selectProductStatus } from "../userSlice";
import { Package, Truck, CheckCircle, MapPin } from "lucide-react";

export default function UserOrdersDetailspage() {
  const dispatch = useDispatch();
  const { id: orderId } = useParams();

  const productStatus = useSelector(selectProductStatus);
  const [order, setOrder] = useState(null);

  const awb = productStatus?.data?.shipments?.awb;
  const status = productStatus?.data?.shipments?.status || "Processing";

  useEffect(() => {
    dispatch(fetchproductorderbyidAsync(orderId));
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const res = await dispatch(fetchorderbyidAsync(orderId)).unwrap();
    setOrder(res);
  };

  const statusMap = {
    Processing: { color: "bg-yellow-400", icon: Package },
    Shipped: { color: "bg-blue-500", icon: Truck },
    Delivered: { color: "bg-emerald-500", icon: CheckCircle },
  };

  const StatusIcon = statusMap[status]?.icon || Package;

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 p-4 sm:p-8">

      {/* ===== ORDER HERO ===== */}
      <div className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-8
        bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600
        text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

        <p className="text-sm opacity-80">Order ID</p>
        <p className="font-mono text-lg sm:text-xl tracking-wider break-all">
          #{order.id}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full 
            text-sm font-semibold shadow-lg ${statusMap[status]?.color}`}>
            <StatusIcon size={16} />
            {status.toUpperCase()}
          </div>

          {awb && (
            <a
              href={`https://shiprocket.co/tracking/${awb}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-white/20 backdrop-blur 
                text-sm font-semibold hover:bg-white/30 transition"
            >
              Track Package →
            </a>
          )}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-5xl mx-auto mt-10 space-y-8">

        {/* ===== PRODUCTS ===== */}
        {order.items.map(item => (
          <div
            key={item.id}
            className="relative rounded-3xl bg-white shadow-xl overflow-hidden"
          >
            {/* Accent strip */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

            <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8">
              {/* IMAGE */}
              <div className="w-full sm:w-40 h-48 rounded-2xl overflow-hidden shadow-md border">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-snug">
                    {item.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Size: <b>{item.size}</b></span>
                    <span>Qty: <b>{item.quantity}</b></span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-end">
                  <p className="text-2xl font-extrabold text-indigo-700">
                    ₹{item.selling_price}
                  </p>

                  <button
                    className="px-6 py-3 rounded-xl bg-red-500 text-white
                      font-semibold shadow hover:bg-red-600 transition"
                  >
                    Request Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ===== ADDRESS ===== */}
        <div className="rounded-3xl bg-white shadow-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">
              Delivery Address
            </h2>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-5">
            <p className="font-semibold text-gray-900">
              {order.items[0].selectedAddress.name}
            </p>
            <p className="text-gray-700 text-sm mt-1">
              {order.items[0].selectedAddress.street}
            </p>
            <p className="text-gray-700 text-sm">
              {order.items[0].selectedAddress.city} – {order.items[0].selectedAddress.pinCode}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-800">
              📞 {order.items[0].selectedAddress.phone}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
