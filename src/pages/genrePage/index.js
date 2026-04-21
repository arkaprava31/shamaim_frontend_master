import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProductFilter } from "../../hooks/useProductFilter";
import { fetchProductsByGenreAsync } from "../../features/product/productSlice";
import FilterWrapper from "../../pages/filter/filterWrapper";

export const Genrepage = () => {
  const { name } = useParams();

  const [loadedImages, setLoadedImages] = useState({});
  const [bannerLoading, setBannerLoading] = useState(true);

  const generUi = [
    {
      name: "Abstract",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FModern%20abstract.png?alt=media&token=6343626f-1745-4135-8e79-238bd9a3ede1",
      link: "abstract",
    },
    {
      name: "Anime",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FAnime.png?alt=media&token=c27952ea-efb5-4fd9-8a42-6cef4e80350f",
      link: "anime",
    },
    {
      name: "Bangla O Bangali",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Assets%2FBanglaBanner.png?alt=media&token=8b9ecf3c-9842-4704-a22f-743e13cebf79",
      link: "bangla-o-bangali",
    },
    {
      name: "Drip & Doodle",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Assets%2Fdoodlebanner.png?alt=media&token=550ee544-c797-4827-807c-5a9c88d7a6e0",
      link: "drip-&-doodle",
    },
    {
      name: "Movies & Series",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FMoves%20and%20series.png?alt=media&token=bb4cbca6-122f-4460-9349-8759ade881d9",
      link: "movies-&-series",
    },
    {
      name: "Music & Band",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FMusic%20and%20Band.png?alt=media&token=7fef1713-3f6d-4f63-b492-ae1db15bc6f6",
      link: "music-&-band",
    },
    {
      name: "Sports",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FSports.png?alt=media&token=9857f2eb-2e39-4f64-932e-74212fa0966f",
      link: "sports",
    },
    {
      name: "Superhero",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FSuper%20Heroes.png?alt=media&token=907bb203-c044-4a3b-94eb-051b07c0e5f6",
      link: "superhero",
    },
  ];

  const banner = generUi.find((g) => g.link === name);

  const {
    products,
    loading,
    hasMore,
    loaderRef,
    filters,
    handleFilterChange,
    handleClearFilters,
  } = useProductFilter(fetchProductsByGenreAsync, {
    genre: banner?.name, // ✅ fixed genre always applied
  });

  const initialLoading = loading && products.length === 0;

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    setBannerLoading(true);
  }, [name]);

  return (
    <>
      {/* Banner */}
      {banner && (
        <div className="w-full relative">
          {bannerLoading && (
            <div className="w-full h-[200px] md:h-[350px] bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-sm animate-pulse">
                Loading banner...
              </p>
            </div>
          )}

          <img
            src={banner.url}
            alt={banner.name}
            onLoad={() => setBannerLoading(false)}
            className={`w-full object-cover ${
              bannerLoading ? "hidden" : "block"
            }`}
          />
        </div>
      )}

      {/* FilterWrapper */}
      <FilterWrapper
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        disableGenre={true} 
      >
        {(initialLoading || products.length !== 0) && (
          <div className="w-full flex justify-center mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8 p-4 w-full font-poppins">

              {/* Initial Skeleton */}
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
                          loadedImages[product.id]
                            ? "opacity-100"
                            : "opacity-0"
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
                        {product.title}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{discountedPrice}
                        </p>

                        <p className="text-xs text-gray-400 line-through">
                          ₹{product.price}
                        </p>
                      </div>

                      {product.stock <= 0 && (
                        <p className="text-xs text-red-500">Coming Soon</p>
                      )}
                    </div>
                  </Link>
                );
              })}

              {/* Load more skeleton */}
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

        {/* Empty */}
        {!initialLoading && products.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-sm">
            No products found for this genre.
          </div>
        )}

        <div ref={loaderRef}></div>
      </FilterWrapper>
    </>
  );
};