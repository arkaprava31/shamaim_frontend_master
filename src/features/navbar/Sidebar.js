import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { BiSolidUser } from "react-icons/bi";
import { GiFemaleVampire } from "react-icons/gi";
import { FcBusinessman, FcBusinesswoman, FcAbout } from "react-icons/fc";
import { GrUserManager } from "react-icons/gr";
import { PiHeadset } from "react-icons/pi";
import { getId } from '../../app/constants';
import Logo from "./sitelogo.png";
import { useState } from 'react';

const Sidebar = ({ toggle, handleClick }) => {
  const [dropdown, setDropdown] = useState({}); // Store the open/close state for each dropdown

  const toggleDropdown = (name) => {
    setDropdown((prev) => ({
      ...prev,
      [name]: !prev[name], // Toggle the state of the clicked dropdown
    }));
  };

  const renderSubcategories = (subcategories, parentName) => (
    <div className="ml-4 border-l pl-4">
      {subcategories.map((subcategory) => (
        <div key={subcategory.name} className="flex flex-col py-2">
          {subcategory.subcategories ? (
            <>
              <div
                className="text-sm cursor-pointer hover:font-semibold flex items-center"
                onClick={() => toggleDropdown(`${parentName}-${subcategory.name}`)}
              >
                {subcategory.name}
                <span className="ml-2 text-xs">{dropdown[`${parentName}-${subcategory.name}`] ? '-' : '+'}</span>
              </div>
              {dropdown[`${parentName}-${subcategory.name}`] &&
                renderSubcategories(subcategory.subcategories, `${parentName}-${subcategory.name}`)}
            </>
          ) : (
            <Link to={subcategory.link} onClick={handleClick} className="text-sm hover:font-semibold">
              {subcategory.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  );

  const navigation = [
    {
      name: 'Men',
      link: null,
      icon: <FcBusinessman />,
      subcategories: [
        {
          name: 'Hoodies',
          link: null, // No direct navigation for Hoodies
          subcategories: [
            { name: 'Crewneck', link: '/men/hoodies/crewneck' },
            { name: 'Oversized', link: '/men/hoodies/oversized' },
          ],
        },
        {
          name: 'T-Shirts',
          link: "/men", // No direct navigation for Hoodies
          subcategories: [
            { name: 'Crewneck', link: '/men/crewneck' },
            { name: 'Oversized', link: '/men/oversized' },
          ],
        },      ],
    },
    {
      name: 'Women',
      link: null,
      icon: <FcBusinessman />,
      subcategories: [
        {
          name: 'Hoodies',
          link: null, // No direct navigation for Hoodies
          subcategories: [
            { name: 'Crewneck', link: '/women/hoodies/crewneck' },
            { name: 'Oversized', link: '/women/hoodies/oversized' },
          ],
        },
        {
          name: 'T-Shirts',
          link: "/women", // No direct navigation for Hoodies
          subcategories: [
            { name: 'Crewneck', link: '/women/crewneck' },
            { name: 'Oversized', link: "/women/oversized" },
          ],
        },
      ],
    },
    { name: 'Help', link: '/contactus', icon: <PiHeadset /> },
    { name: 'About Us', link: '/aboutus', icon: <FcAbout /> },
    { name: 'Custom Design', link: '/aboutus', icon: <FcAbout /> },
  ];

  const id = getId();

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-[80vw] bg-white h-[100vh] overflow-y-auto z-10 transition-transform duration-300 ease-in-out ${
          toggle ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 text-white bg-blue-700 border-b border-gray-200">
          <div className="flex justify-center items-center gap-3">
            <BiSolidUser className="text-white" size={24} />
            {id ? "Hello User" : <Link to={'/login'} className="text-lg">Login & Signup</Link>}
          </div>
          <button onClick={handleClick} className="text-2xl focus:outline-none">
            <img src={Logo} className="w-8 h-8" alt="logo" />
          </button>
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          {navigation.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between items-center py-2">
                {item.subcategories ? (
                  <div
                    className="flex items-center space-x-4 text-lg cursor-pointer"
                    onClick={() => toggleDropdown(item.name)}
                  >
                    <p>{item.name}</p>
                    <span className="text-xs font-bold">{dropdown[item.name] ? '-' : '+'}</span>
                  </div>
                ) : (
                  <Link to={item.link} onClick={handleClick} className="flex items-center space-x-4">
                    <p className="text-lg">{item.name}</p>
                  </Link>
                )}
                <span className="text-2xl">{item.icon}</span>
              </div>
              {dropdown[item.name] && item.subcategories && renderSubcategories(item.subcategories, item.name)}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <p className="text-center">Follow Us</p>
          <div className="flex justify-center items-center space-x-6 mt-2">
            <a
              href="https://www.facebook.com/profile.php?id=100093530476365&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-black"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100093530476365&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl text-gray-600 hover:text-black"
            >
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>
      {toggle && <div className="fixed inset-0 bg-black bg-opacity-50 z-5" onClick={handleClick}></div>}
    </>
  );
};

export default Sidebar;
