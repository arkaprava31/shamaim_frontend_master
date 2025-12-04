import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import NavBar from "../../features/navbar/Navbar";

import { fetchProductMusicAsync } from "./GenereSlice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Footer from "../../features/common/Footer";

const MusicProductPage = ({ status }) => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPaginaruin] = useState();
  const [filtergender, setfiltergender] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const oversized = async () => {
      const responce = await dispatch(
        fetchProductMusicAsync({ filter, sort, pagination })
      );
      setPopularProducts(responce.payload.products);
      console.log(popularProducts.docs)
    };
    oversized();
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FMusic%20and%20Band.png?alt=media&token=7fef1713-3f6d-4f63-b492-ae1db15bc6f6"
        alt="Bangla o Bangali"
      />
      <div className="bg-white">
        <div className="max-w-2xl px-4 py-0 mx-auto sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {status === "loading" ? (
              <Grid
                height="80"
                width="80"
                color="rgb(79, 70, 229) "
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            ) : null}
            {popularProducts?.docs?.map((product) => (
              <Link to={`/product-detail/${product.id}`} key={product.id}>
                <div className="relative p-2 border-2 border-gray-200 border-solid group">
                  <div className="w-full overflow-hidden bg-gray-200 rounded-md min-h-60 aspect-h-1 aspect-w-1 lg:aspect-none group-hover:opacity-75 lg:h-60">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <div href={product.thumbnail}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {product.title}
                        </div>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                      {/* <StarIcon className="inline w-6 h-6"></StarIcon> */}
                   <span className='font-medium text-black '>discount:</span>   <span className=" align-bottom font-medium text-[#388e3c] ">{product.discountPercentage}% off</span>
                    </p>
                    </div>
                    <div>
                      <p className="block text-sm font-medium text-gray-900">
                        ₹
                        {Math.floor(
                          product.price -
                            product.price * (product.discountPercentage / 100)
                        )}
                      </p>
                      <p className="block text-sm font-medium text-gray-400 line-through">
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
                      <p className="text-sm text-red-400">Comming Soon</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MusicProductPage;
