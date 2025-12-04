import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import NavBar from "../../features/navbar/Navbar";
import { fetchProductSuperHeroAsync } from "./GenereSlice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Footer from "../../features/common/Footer";

const SuperheroProductPage = ({ status }) => {
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
        fetchProductSuperHeroAsync({ filter, sort, pagination })
      );
      console.log(responce.payload.products.docs);
      setPopularProducts(responce?.payload?.products?.docs);
    };

    oversized();
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FSuper%20Heroes.png?alt=media&token=907bb203-c044-4a3b-94eb-051b07c0e5f6"
        alt=""
      />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
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
            {popularProducts?.map((product) => (
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
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
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
                        ₹
                        {Math.floor(
                          product.price -
                          product.price * (product.discountPercentage / 100)
                        )}
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

export default SuperheroProductPage;
