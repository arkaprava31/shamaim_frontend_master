import React, { useEffect, useState, useRef } from "react";
import { fetchProductsWomenOversizedAsync } from "../productSlice";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";

export default function WomenOversized() {
  const [products, setProducts] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const loader = useRef(null);
  const { pattern } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await dispatch(
        fetchProductsWomenOversizedAsync({ page })
      ).unwrap();

      let newProducts = res?.products?.docs || [];

      if (pattern === "solid") {
        newProducts = newProducts.filter(
          (p) => p.genre?.length === 0
        );
      }

      if (newProducts.length === 0) {
        setHasMore(false);
      }

      setProducts((prev) => [...prev, ...newProducts]);
    } catch (err) {
      setError("Error while fetching the data");
    }

    setLoading(false);
    setInitialLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    setProducts([]);
    setLoadedImages({});
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    setBannerLoading(true);
  }, [pattern]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );

    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [loading, hasMore]);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <div className="h-full relative">

        {bannerLoading && (
          <div className="w-full h-[200px] md:h-[350px] bg-gray-200 animate-pulse flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading banner...</p>
          </div>
        )}

        <img
          src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Category%20wallpepar%2FWomen%20oversized.png?alt=media&token=aebc87ba-ec34-4f36-b43c-cff7ab47cc55"
          onLoad={() => setBannerLoading(false)}
          className={`${bannerLoading ? "hidden" : "block"}`}
        />
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {(initialLoading || products.length !== 0) && (
        <div className="w-full flex justify-center mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8 p-4 w-full md:w-[80%] font-poppins">

            {initialLoading &&
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="w-full h-52 md:h-64 bg-gray-200 animate-pulse"></div>

                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              ))}

            {products.map((product) => {
              const discountedPrice = Math.floor(
                product.price -
                product.price *
                (product.discountPercentage / 100)
              );

              return (
                <Link
                  to={`/product-detail/${product.id}`}
                  key={product.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden 
                hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative overflow-hidden">

                    {!loadedImages[product.id] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    )}

                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      onLoad={() => handleImageLoad(product.id)}
                      className={`w-full h-52 md:h-64 object-cover group-hover:scale-105 transition duration-300 ${
                        loadedImages[product.id] ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {product.discountPercentage > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                        {Math.round(product.discountPercentage)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-3 flex flex-col gap-1">

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Shamaim
                    </p>

                    <p className="text-sm text-gray-700 font-medium line-clamp-2">
                      {product.AboutTheDesign?.slice(0, 45)}...
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{discountedPrice}
                      </p>

                      <p className="text-xs text-gray-400 line-through">
                        ₹{product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}

            {loading &&
              [...Array(4)].map((_, i) => (
                <div
                  key={"loading" + i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="w-full h-52 md:h-64 bg-gray-200 animate-pulse"></div>

                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {!initialLoading && products.length === 0 && (
        <div className="w-full text-center text-sm text-gray-700 py-8">
          No products found.
        </div>
      )}

      <div ref={loader}></div>
    </>
  );
}