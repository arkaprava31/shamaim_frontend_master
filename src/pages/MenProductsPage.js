import React from 'react'
import NavBar from '../features/navbar/Navbar'
import Footer from '../features/common/Footer'
import Allothercategory from './LandingPage/Allothercategory/Allothercategory'
import ProductMenList from '../features/productmen/components/ProductMenList'
const MenProductsPage = () => {
  return (
    <div>
        <Allothercategory></Allothercategory>
        <ProductMenList></ProductMenList>
      
    </div>
  )
}

export default MenProductsPage
