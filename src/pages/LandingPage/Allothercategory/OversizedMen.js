import React from 'react'
import NavBar from '../../../features/navbar/Navbar'
import Footer from '../../../features/common/Footer'
import ProductList from '../../../features/product/components/ProductList'
import Allothercategory from './Allothercategory'
import ProductMenOversized from '../../../features/productmen/components/ProductMenOversized'



const OversizedMen = () => {
  return (
    <div>
    <Allothercategory></Allothercategory>
    <ProductMenOversized></ProductMenOversized>
    </div>
  )
}

export default OversizedMen
