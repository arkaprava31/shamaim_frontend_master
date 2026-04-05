import { useState, useEffect, useMemo } from "react";
import { fetchProductsWomensPoloAsync } from "../productSlice";
import { Link, useParams } from "react-router-dom";
import { useProductFilter } from "../../../hooks/useProductFilter";
import FilterWrapper from "../../../pages/filter/filterWrapper";
import { WOMEN_FILTER_CONFIG } from "../../../config/filterConfig";

export default function WomensPolo() {
  const [loadedImages, setLoadedImages] = useState({});
  const [bannerLoading, setBannerLoading] = useState(true);

  const { pattern } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    products: allProducts,
    loading,
    error,
    hasMore,
    loaderRef,
    filters,
    handleFilterChange,
    handleClearFilters,
  } = useProductFilter(fetchProductsWomensPoloAsync);

  const initialLoading = loading && allProducts.length === 0;

  // Pattern filter stacked on top of hook's client-side filters
  const products = useMemo(() => {
    if (pattern === "solid") {
      return allProducts.filter((p) => p.isSolid === true);
    }
    return allProducts.filter((p) => !p.isSolid || p.isSolid === false);
  }, [allProducts, pattern]);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      {/* Banner — full width, outside FilterWrapper */}
      <div className="h-full relative mt-1">
        {bannerLoading && (
          <div className="w-full h-[475px] md:h-[350px] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400 text-sm animate-pulse">
              Loading banner...
            </p>
          </div>
        )}
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={
              pattern === "solid"
                ? ""
                : ""
            }
          />
          <img
            src={
              pattern === "solid"
                ? ""
                : ""
            }
            alt="Mens Polo Tees"
            onLoad={() => setBannerLoading(false)}
            className={`${bannerLoading ? "hidden" : "block"} w-full`}
          />
        </picture>
      </div>

      {/* Filter sidebar + product grid */}
      <FilterWrapper
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterConfig={WOMEN_FILTER_CONFIG}
      >
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {(initialLoading || products.length !== 0) && (
          <div className="w-full flex justify-center mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8 p-4 w-full font-poppins">

              {/* Initial skeleton */}
              {initialLoading &&
                [...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="w-full h-52 md:h-64 bg-gray-200 animate-pulse"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                ))}

              {/* Product cards — unchanged */}
              {products.map((product) => {
                const discountedPrice = Math.floor(
                  product.price - product.price * (product.discountPercentage / 100)
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
                        className={`w-full h-52 md:h-64 object-cover group-hover:scale-105 transition duration-300 ${loadedImages[product.id] ? "opacity-100" : "opacity-0"
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
                        <p className="text-sm font-semibold text-gray-900">₹{discountedPrice}</p>
                        <p className="text-xs text-gray-400 line-through">₹{product.price}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Load-more skeleton */}
              {loading && !initialLoading &&
                [...Array(4)].map((_, i) => (
                  <div key={"loading" + i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
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

        {/* Empty state */}
        {!initialLoading && products.length === 0 && (
          <div className="w-full text-center text-sm text-gray-700 py-8">
            No products found.
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={loaderRef}></div>
      </FilterWrapper>
    </>
  );
}