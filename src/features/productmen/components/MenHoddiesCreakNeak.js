import { useState, useEffect, useRef } from "react";
import { fetchCategoryProductAsync } from "../productSlice";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";

export default function MenHoddiesCreackneak() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loader = useRef(null);
  const dispatch = useDispatch();
  const { pattern } = useParams();

  const subcategories = "Classic Fit";
  const gender = "Male";

  const fetchProducts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await dispatch(
        fetchCategoryProductAsync({ page, subcategories, gender })
      ).unwrap();

      let newProducts = res.products.docs;

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
      console.error("Error fetching data", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
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

  return (
    <>
      <div className="w-full">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Category%20wallpepar%2Fmen%20crewneck.jpg?alt=media&token=1b96b61c-601d-4da0-9ead-afc351c26952"
          alt="Men Crewneck"
          className="w-full object-cover"
        />
      </div>

      <div className="w-full flex justify-center mt-6">
        {products.length === 0 ? (
          <div className="w-full text-center text-sm text-gray-700">
            No products found.
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
}