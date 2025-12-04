import React from 'react'
import ProductList from '../features/product/components/ProductList'
import NavBar from '../features/navbar/Navbar'
import Footer from '../features/common/Footer'
import Allothercategory from './LandingPage/Allothercategory/Allothercategory'
import ProductWomenList from '../features/productmen/components/ProductWomenList';
const WomenProductsPage = () => {
  return (
    <div>
        <Allothercategory></Allothercategory>
        {/* <ProductList></ProductList> */}
        <ProductWomenList></ProductWomenList>
      
    </div>
  )
}

export default WomenProductsPage
