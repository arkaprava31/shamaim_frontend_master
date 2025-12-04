import { Link, useLocation } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { selectItems } from "../cart/cartSlice";
import shamaim from "../../pages/LandingPage/Assets/SHAMAIM.png";
import { FaOpencart } from "react-icons/fa6";
import {fetchItemsByUserIdAsync,addToCartAsync} from "../cart/cartSlice";
import { fetchLoggedInUserAsync } from "../user/userSlice";
import { useDispatch } from "react-redux";
import { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getId } from "../../app/constants";
import { AppContext } from "../../app/Context";

function NavBar({ children }) {
  const items = useSelector(selectItems);
  const [toggle, setToggle] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState("");
  const dispatch = useDispatch();

  const {
    totalItems,
    updateCart,
    updateLoggedInCart,
    isLoggedInOrGuest,
    handleLoggedInOrGuest,
  } = useContext(AppContext);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleClick = () => {
    setToggle(!toggle);
  };

  const showButton = location.pathname === "/";

  useEffect(() => {
    if (showButton == true) {
      const storedUser = localStorage.getItem("id");
      setUser(storedUser);
    }
  }, [showButton]);

  useEffect(() => {
    async function getcartitem() {
      if (user && showButton == true) {
        await dispatch(fetchItemsByUserIdAsync());
       await dispatch(addToCartAsync());
      await  dispatch(fetchLoggedInUserAsync());
      }
    }
    getcartitem();
  }, [user, showButton]);

  useEffect(() => {
    updateCart();
    handleLoggedInOrGuest();
  }, []);

  useEffect(() => {
    if (getId()) {
      updateLoggedInCart(items);
    }
  }, [items]);

  const dropDown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div className="h-full py-7">
        <div className="fixed flex justify-between items-center w-full h-[9vh] bg-white shadow top-0 left-0  z-10 ">
          <div className="flex justify-evenly items-center w-[40vw] md:3-2/4 h-[10vh]">
            <div>
              {showButton ? (
                <div
                  className="flex items-center justify-evenly w-[10vw] md:hidden"
                  onClick={handleClick}
                >
                  <img
                    src="https://images.bewakoof.com/web/ic-web-head-hamburger.svg"
                    alt="menu"
                  />
                </div>
              ) : (
                <div className="cursor-pointer">
                  <Link to={"/"}>
                    <img
                      src="https://images.bewakoof.com/web/ic-web-head-primary-back.svg"
                      alt="back"
                    />
                  </Link>
                </div>
              )}
            </div>
            <div className="w-16">
              <Link to={"/"}>
                <img src={shamaim} alt="brand logo" />
              </Link>
            </div>
            <div className="w-[50%] hidden lg:block">
              <div className="w-full flex justify-between items-center">
                <Link
                  to="/men"
                  onMouseEnter={dropDown}
                  onMouseLeave={dropDown}
                  className="cursor-pointer"
                >
                  Men
                </Link>
                <Link
                  to="/women"
                  onMouseEnter={dropDown}
                  onMouseLeave={dropDown}
                  className="cursor-pointer"
                >
                  Women
                </Link>
              </div>
              {showDropdown && (
                <div className="absolute  bg-white shadow-lg rounded-md mt-2">
                  <ul className="p-2">
                    <li>
                      <Link to="/men/classic-fit" className="block px-4 py-2">
                        Classic Fit
                      </Link>
                    </li>
                    <li>
                      <Link to="/men/oversized" className="block px-4 py-2">
                        Oversized
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-evenly items-center h-[4vh] w-[30vw]">
            <Link
              to={isLoggedInOrGuest ? "/cart" : "/login"}
              className="flex items-center mt-2"
            >
              <FaOpencart size={20} className="relative" />
              <span className="absolute top-3 text-xs ml-2 px-1 bg-orange-700 rounded-full text-white">
                {totalItems}
              </span>
            </Link>
            <Link to={"/Account"} className="flex items-center cursor-pointer">
              <VscAccount size={24} />
            </Link>
          </div>
        </div>
        <Sidebar toggle={toggle} handleClick={handleClick} />
        <main>
          <div className="py-0 mx-auto max-w-7xl sm:px-0 lg:px-0">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export default NavBar;
