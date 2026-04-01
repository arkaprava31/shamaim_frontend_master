import React from "react";
import { Link } from "react-router-dom";
import Loader from "../../../app/loader";
import FilterWrapper from "../../../pages/filter/filterWrapper";
import { useProductFilter } from "../../../hooks/useProductFilter";
import {MEN_FILTER_CONFIG} from "../../../config/filterConfig";
import { fetchProductsWomenAsync } from "../productSlice";


export default function ProductMen() {
  const {
    products,
    error,
    loading,
    hasMore,
    loaderRef,
    filters,
    handleFilterChange,
    handleClearFilters,
    
  } = useProductFilter(fetchProductsWomenAsync);

  return (
    <FilterWrapper
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      filterConfig={MEN_FILTER_CONFIG}
    >
      {/* Header */}
      <div className="my-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Men's Collection
        </h1>
        <p className="text-gray-600 text-center">
          {products.length} products found
          {filters.color.length > 0 && ` • ${filters.color.length} color filters`}
          {filters.size.length  > 0 && ` • ${filters.size.length} size filters`}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4 text-4xl">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or clear them to see more products
            </p>
          </div>
        )}

        {products.map((product) => (
          <Link
            to={`/product-detail/${product.id}`}
            key={product.id}
            className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.discountPercentage > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {Math.round(product.discountPercentage)}% OFF
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {product.title || "Product"}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
                {product.AboutTheDesign || ""}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{Math.floor(
                      product.price -
                      (product.price * (product.discountPercentage || 0)) / 100
                    )}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                {product.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t pt-3">
                <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  100% Cotton
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center my-8">
          <Loader />
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && !loading && (
        <div ref={loaderRef} className="py-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span>Loading more products...</span>
          </div>
        </div>
      )}
    </FilterWrapper>
  );
}