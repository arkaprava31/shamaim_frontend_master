import React from 'react';
import { useSelector } from 'react-redux';
import { IoCubeOutline } from "react-icons/io5";
import { PiHeadset } from "react-icons/pi";
import { AiOutlineUser } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { GrNext } from "react-icons/gr";
import { Link } from "react-router-dom";
import { selectUserInfo} from '../userSlice';
const links = [
  { to: '/my-orders', icon: IoCubeOutline, label: 'Orders' },
  // { to: '#', icon: AiOutlineUser, label: 'Edit Profile' },
  { to: '/address', icon: IoLocationOutline, label: 'Saved Address' },
  { to: '/contactus', icon: PiHeadset, label: 'Help Center' },
];

export const UserProfile = () => {
  const user=useSelector(selectUserInfo);
  return (
    <div className="font-poppins">
      <div className="bg-white shadow-lg w-[100vw] h-[8vh]">
        <h1 className="flex gap-1 px-1 text-xl py-2 font-semibold rounded-t-3xl mt-2">
          Hey!<h1>User</h1>
        </h1>
      </div>
      <div className="bg-white shadow-lg w-[100vw] h-[60vh] mt-3">
        <h1 className="text-xl font-bold px-1 py-2">Account Settings</h1>
        <div className="flex flex-col   px-4 h-[60%]">
          {links.map((link, index) => (
            <Link to={link.to} key={index} className="flex w-full justify-between py-4 items-center cursor-pointer">
              <div className="flex w-[40%] items-center gap-3">
                {React.createElement(link.icon)}
                <p>{link.label}</p>
              </div>
              <GrNext />
            </Link>
          ))}
        </div>
      </div>
      <Link to={'/logout'} className="bg-white shadow-lg w-[100vw] mt-3 mb-4 py-3 rounded-t-xl flex justify-center items-center text-lg">
        <button>Logout</button>
      </Link>
    </div>
  );
};
