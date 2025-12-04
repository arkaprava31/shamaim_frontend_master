import React, {useState,useEffect}from 'react'
import { Link } from 'react-router-dom'
const MensProduct = () => {
  
  const [popularProducts,setPopularProducts]=useState([])

  useEffect(()=>{
    fetch('http://localhost:3000/menproduct')
    .then((response)=>response.json())
    .then((data)=>setPopularProducts(data))
  },[])

  return (
    <div className="popular">
        <h1>Mens</h1>
        <hr />
        <div className="popular-item">
        {/* data_product.map() this is used for file */ }
        {popularProducts.map((product) => (
            <Link to={`/product-detail/${product.id}`} key={product.id}>
              <div className="group relative border-solid border-2 p-2 border-gray-200">
                <div className="min-h-60 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <div href={product.thumbnail}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </div>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {/* <StarIcon className="w-6 h-6 inline"></StarIcon> */}
                   <span className=' text-black font-medium'>discount:</span>   <span className=" align-bottom font-medium text-[#388e3c] ">{product.discountPercentage}% off</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm block font-medium text-gray-900">
                    ₹{ Math.floor( product.price-product.price * (product.discountPercentage / 100))}
                    </p>
                    <p className="text-sm block line-through font-medium text-gray-400">
                    ₹{product.price}
                    </p>
                  </div>
                </div>
                {product.deleted && (
                  <div>
                    <p className="text-sm text-red-400">product deleted</p>
                  </div>
                )}
                {product.stock <= 0 && (
                  <div>
                  <p className="text-sm text-yellow-500">Comming Soon</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        
      
    </div>
  )
}

export default MensProduct

