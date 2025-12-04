import React from 'react'
import NavBar from '../../../features/navbar/Navbar'
import Footer from '../../../features/common/Footer'
// import ProductList from '../features/product/components/ProductList'

import ProductList from '../../../features/product/components/ProductList'
import CrewneckProduct from '../../../features/productmen/components/CrewneckProduct';
import Allothercategory from './Allothercategory';
export const CrewneckMen = () => {
  return (
    <div>
      <Allothercategory></Allothercategory>
      <CrewneckProduct></CrewneckProduct>
    </div>
  )
};