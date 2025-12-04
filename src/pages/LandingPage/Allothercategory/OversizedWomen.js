import React from 'react'
import NavBar from '../../../features/navbar/Navbar'
import Footer from '../../../features/common/Footer'
import ProductList from '../../../features/product/components/ProductList'
import Allothercategory from './Allothercategory'
import WomenOversized from '../../../features/productmen/components/womenOversized'



const OversizedWomen = () => {
  return (
    <div>
    <Allothercategory></Allothercategory>
    <WomenOversized></WomenOversized>
    </div>
  )
}

export default OversizedWomen
