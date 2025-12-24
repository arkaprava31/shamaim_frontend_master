import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { fetchProductsByFiltersAsync } from "../productSlice";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../../../app/loader";
import FilterWrapper from "../../../pages/filter/filterWrapper";

export default function ProductMen() {
  const [menData, setMenData] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const dispatch = useDispatch();
  const loader = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    return {
      color: searchParams.get("color")?.split(",").filter(Boolean) || [],
      size: searchParams.get("size")?.split(",").filter(Boolean) || [],
      genre: searchParams.get("genre")?.split(",").filter(Boolean) || [],
      sort: searchParams.get("sort") || "",
      priceRange: searchParams.get("priceRange") || ""
    };
  }, [searchParams]);

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (filterType === "color" || filterType === "size" || filterType === "genre") {
      if (Array.isArray(value) && value.length > 0) {
        newParams.set(filterType, value.join(","));
      } else {
        newParams.delete(filterType);
      }
    } else {
      if (value) {
        newParams.set(filterType, value);
      } else {
        newParams.delete(filterType);
      }
    }

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const getDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filterParams = {
        page,
        limit: 20,
        category: "men"
      };

      if (filters.color.length > 0) {
        filterParams.color = filters.color.join(",");
      }
      if (filters.size.length > 0) {
        filterParams.size = filters.size.join(",");
      }
       if (filters.genre.length > 0) {
        filterParams.genre = filters.genre.join(",");
      }
      if (filters.sort) {
        filterParams.sort = filters.sort;
      }
      if (filters.priceRange) {
        const pr = filters.priceRange.trim();
        if (pr.startsWith("<")) {
          const val = parseFloat(pr.slice(1));
          if (!Number.isNaN(val)) filterParams.maxPrice = val;
        } else if (pr.includes("-")) {
          const [minS, maxS] = pr.split("-").map(s => s.trim());
          const min = parseFloat(minS);
          const max = parseFloat(maxS);
          if (!Number.isNaN(min) && !Number.isNaN(max)) {
            filterParams.minPrice = min;
            filterParams.maxPrice = max;
          }
        }
      }

      const data = await dispatch(fetchProductsByFiltersAsync(filterParams)).unwrap();
      const docs = data?.products?.docs || [];
      console.log("data", docs);


      if (page === 1) {
        setMenData(docs);
      } else {
        setMenData(prev => [...prev, ...docs]);
      }

      const totalDocs = data?.products?.totalDocs ?? 0;
      const hasMoreData = (menData.length + docs.length) < totalDocs;
      setHasMore(hasMoreData);

    } catch (err) {
      console.error(err);
      setError("Error while fetching the data");
    } finally {
      setLoading(false);
    }
  }, [dispatch, page, filters, menData.length]);

  useEffect(() => {
    if (page === 1) {
      getDetails();
    } else {
      setPage(1);
    }
  }, [filters]);

  useEffect(() => {
    getDetails();
  }, [page]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore) {
        setPage(prev => prev + 1);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.1
    });

    if (loader.current && hasMore) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver, hasMore]);

  const displayedProducts = useMemo(() => {
    if (!Array.isArray(menData)) return [];

    let out = [...menData];

    // Client-side filters as fallback
    if (filters.color.length > 0) {
      out = out.filter((p) => {
        let pColors = [];
        if (p.colors.length > 0) {
           pColors = p.colors;
        }
        else {
           pColors = [p.color];
        }

        if (Array.isArray(pColors)) {
          return filters.color.some((c) =>
            pColors.some(pc =>
              String(pc).toLowerCase() === c.toLowerCase()
            )
          );
        }
        return false;
      });
    }

  if (filters.size.length > 0) {
  out = out.filter((p) => {
    let pSizes =  [];
    if (p.sizes.length > 0) {
      pSizes = p.sizes;
    } else {
      pSizes = p.size;
    }

    // normalize to array
    if (!Array.isArray(pSizes)) {
      pSizes = [pSizes];
    }

    // normalize product sizes
    const normalizedProductSizes = pSizes
      .filter(Boolean)
      .map(ps => ps.toString().trim().toLowerCase());

    // normalize filter sizes
    const normalizedFilterSizes = filters.size.map(s =>
      s.toString().trim().toLowerCase()
    );

    return normalizedFilterSizes.some(fs =>
      normalizedProductSizes.includes(fs)
    );
  });
}

const normalizeGenre = (str = "") =>
  str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "")
    .trim();

const GENRE_MAP = {
  "music & band": "music band",
  "movies & series": "movies series",
  "super hero": "superhero",
  "drip & doodle": "drip doodle",
};

if (filters.genre.length > 0) {
  out = out.filter((p) =>
    filters.genre.some((g) =>
      normalizeGenre(p.category) ===
      normalizeGenre(GENRE_MAP[g] || g)
    )
  );
}




    if (filters.sort === "price-asc") {
      out.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (filters.sort === "price-desc") {
      out.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return out;
  }, [menData, filters]);

  return (
    <FilterWrapper
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
    >
      <div className="my-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Men's Collection
        </h1>
        <p className="text-gray-600 text-center">
          {displayedProducts.length} products found
          {filters.color.length > 0 && ` • ${filters.color.length} color filters`}
          {filters.size.length > 0 && ` • ${filters.size.length} size filters`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4 text-4xl">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or clear them to see more products</p>
          </div>
        )}

        {displayedProducts.map((product) => (
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
              {product.discountPercentage && (
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
                    ₹{Math.floor(product.price - (product.price * (product.discountPercentage || 0)) / 100)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                  )}
                </div>

                {product.rating>0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
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

      {/* Loading and Infinite Scroll */}
      {loading && (
        <div className="flex justify-center my-8">
          <Loader />
        </div>
      )}

      {hasMore && !loading && (
        <div
          ref={loader}
          className="py-8 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span>Loading more products...</span>
          </div>
        </div>
      )}
    </FilterWrapper>
  );
}