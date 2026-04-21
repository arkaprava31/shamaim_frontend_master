import { useEffect, useMemo } from "react";
import { fetchProductsByFiltersAsync } from "../productSlice";
import { Link } from "react-router-dom";
import { useProductFilter } from "../../../hooks/useProductFilter";
import FilterWrapper from "../../../pages/filter/filterWrapper";
import { MEN_FILTER_CONFIG, WOMEN_FILTER_CONFIG } from "../../../config/filterConfig";

const SimilarProducts = ({ cat, subCat, gender, id }) => {
  const {
    products: allProducts,
    loading,
    hasMore,
    loaderRef,
    filters,
    handleFilterChange,
    handleClearFilters,
  } = useProductFilter(fetchProductsByFiltersAsync);

  const initialLoading = loading && allProducts.length === 0;

  const products = useMemo(() => {
    return allProducts.filter(
      (p) => p.category === cat && p.gender === gender && p.id != id
    );
  }, [allProducts, cat, gender, id]);

  return (
    <>
      <p className="relative p-1 my-6 text-2xl font-bold text-center">
        Similar Products
      </p>

      <FilterWrapper
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterConfig={gender === "Male" ? MEN_FILTER_CONFIG : WOMEN_FILTER_CONFIG}
      >
        <div className="w-full flex justify-center">
          {(initialLoading || products.length !== 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8 p-4 w-full md:w-[100%] font-poppins">

              {/* Initial Skeleton */}
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

              {/* Products */}
              {products.map((product) => {
                const discountedPrice = Math.floor(
                  product.price -
                    product.price * (product.discountPercentage / 100)
                );

                return (
                  <Link
                    to={`/product-detail/${product.id}`}
                    key={product.id}
                    onClick={() => window.scrollTo(0, 0)}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-52 md:h-64 object-cover group-hover:scale-105 transition duration-300"
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

                      <div className="mt-2 w-fit text-[10px] font-semibold px-2 py-1 text-center text-[#737373] border border-[#737373] rounded">
                        100% Cotton
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Infinite Scroll Skeleton */}
              {loading && !initialLoading &&
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
          ) : (
            <div className="text-center text-gray-700 text-sm">
              No similar products found.
            </div>
          )}
        </div>

        <div ref={loaderRef} className="h-10"></div>
      </FilterWrapper>
    </>
  );
};

export default SimilarProducts;