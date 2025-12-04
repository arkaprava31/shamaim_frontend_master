import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "../navbar/Navbar";
export const Homepage = () => {
  return (
    <>
      <div>
        <NavBar/>
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        {/* <Footer /> */}
      </div>
    </>
  );
};
