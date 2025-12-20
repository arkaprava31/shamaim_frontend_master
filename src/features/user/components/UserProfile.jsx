import React from "react";
import { useSelector } from "react-redux";
import { IoCubeOutline, IoLocationOutline } from "react-icons/io5";
import { PiHeadset } from "react-icons/pi";
import { GrNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import { selectUserInfo } from "../userSlice";

const actions = [
  {
    to: "/my-orders",
    label: "My Orders",
    desc: "Track & manage your purchases",
    icon: IoCubeOutline,
  },
  {
    to: "/address",
    label: "Saved Addresses",
    desc: "Manage delivery locations",
    icon: IoLocationOutline,
  },
  {
    to: "/contactus",
    label: "Help Center",
    desc: "Support & FAQs",
    icon: PiHeadset,
  },
];

export const UserProfile = () => {
  const user = useSelector(selectUserInfo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-poppins">

      {/* HERO PROFILE */}
      <div className="relative px-6 pt-10 pb-24">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 z-0" />

        <div className="relative z-10 flex flex-col items-center text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-semibold backdrop-blur">
            {user?.name?.[0] || "U"}
          </div>

          <h1 className="mt-4 text-2xl font-semibold">
            {user?.name || "User"}
          </h1>

          <p className="text-base opacity-90">Welcome back 👋</p>
        </div>
      </div>


      {/* ACTION CARDS */}
      <div className="w-full flex justify-center items-center">
        <div className="-mt-12 px-4 pb-10 relative z-20 w-full md:max-w-[80%] lg:max-w-[50%]">
          <div className="grid gap-4">

            {actions.map((item, index) => (
              <Link
                to={item.to}
                key={index}
                className="group rounded-2xl bg-white p-5 shadow-md transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">

                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <item.icon size={22} />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.desc}
                    </p>
                  </div>

                  <GrNext className="text-gray-400 group-hover:text-gray-700 transition" />
                </div>
              </Link>
            ))}
          </div>

          {/* LOGOUT */}
          <div className="mt-8">
            <Link
              to="/logout"
              className="flex items-center justify-center rounded-2xl bg-white py-4 text-base font-semibold text-red-600 shadow hover:bg-red-50 transition"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};