import React from "react";
import NavBar from "../../../features/navbar/Navbar";
import Footer from "../../../features/common/Footer";
// import ProductList from '../features/product/components/ProductList'
import Allothercategory from "./Allothercategory";
import ProductList from "../../../features/product/components/ProductList";
import WomenCrewneak from "../../../features/productmen/components/womencrewNeak";

const CrewneckWomen = () => {
  return (
    <div>
      <Allothercategory></Allothercategory>
      <WomenCrewneak></WomenCrewneak>
    </div>
  );
};

export default CrewneckWomen;
