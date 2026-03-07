import { useState, useEffect, useRef } from "react";
import { fetchProductsByFiltersAsync } from "../productSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const SimilarProducts = ({ cat, subCat }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const loader = useRef(null);

  const fetchProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const data = await dispatch(
        fetchProductsByFiltersAsync({ page })
      ).unwrap();

      let newProducts = data?.products?.docs || [];

      /* filter similar products */
      newProducts = newProducts.filter(
        (p) => p.category === cat && p.subcategory === subCat
      );

      if (newProducts.length === 0) {
        setHasMore(false);
      }

      setProducts((prev) => [...prev, ...newProducts]);
    } catch (err) {
      setError("Error while fetching the data");
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

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

  return (
    <>
      <p className="relative p-1 my-6 text-2xl font-bold text-center">
        Similar Products
      </p>

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="w-full flex justify-center">
        {products.length === 0 ? (
          <div className="text-center text-gray-700 text-sm">
            No similar products found.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8 p-4 w-full md:w-[80%] font-poppins">
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
          </div>
        )}
      </div>

      {loading && <p className="text-center py-4">Loading...</p>}

      <div ref={loader} className="h-10"></div>
    </>
  );
};

export default SimilarProducts;