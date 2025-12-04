import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { baseUrl } from "../../app/constants";
import axios from "axios";

export const Genrepage = () => {
  const params = useParams();
  const observerRef = useRef();
  const [generData, setGenerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [leftItems, setLeftItems] = useState(1);

  let generUi = [
    {
      name: "Abstract",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FModern%20abstract.png?alt=media&token=6343626f-1745-4135-8e79-238bd9a3ede1",
    },
    {
      name: "Anime",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FAnime.png?alt=media&token=c27952ea-efb5-4fd9-8a42-6cef4e80350f",
    },
    {
      name: "Bangla O Bangali",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Assets%2FBanglaBanner.png?alt=media&token=8b9ecf3c-9842-4704-a22f-743e13cebf79",
    },
    {
      name: "Drip & Doodle",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Assets%2Fdoodlebanner.png?alt=media&token=550ee544-c797-4827-807c-5a9c88d7a6e0",
    },
    {
      name: "Movies & Series",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FMoves%20and%20series.png?alt=media&token=bb4cbca6-122f-4460-9349-8759ade881d9",
    },
    {
      name: "Music & Band",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FMusic%20and%20Band.png?alt=media&token=7fef1713-3f6d-4f63-b492-ae1db15bc6f6",
    },
    {
      name: "Sports",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FSports.png?alt=media&token=9857f2eb-2e39-4f64-932e-74212fa0966f",
    },
    {
      name: "Superhero",
      url: "https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Homejonnerbox%2FSuper%20Heroes.png?alt=media&token=907bb203-c044-4a3b-94eb-051b07c0e5f6",
    },
  ];

  generUi = generUi.filter((item) => item.name == params?.name);



  const headers = { "content-type": "application/json" };

  const getGenerProducts = async () => {
    if (leftItems > 0) {
      try {
        const response = await axios.get(
          `${baseUrl}/products?genre=${params?.name}&pages=${page}`,
          { headers }
        );
        if (response?.data?.docs?.length > 0) {
          setGenerData((prev) => [...prev, ...response.data.docs]);
          setLeftItems(response.data.totalleft || 0); // Set to 0 if undefined
        } else {
          setLeftItems(0); // No more items
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };
  

  useEffect(() => {
    getGenerProducts();
  }, [page]);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="w-full h-[80vh] px-4">
      {generUi.map((item) => (
        <div key={item.name} className="w-full mt-2 md:mt-5  mb-4 ">
          <img
            src={item.url}
            alt={item.name}
            className="w-[100vw]  object-cover rounded-lg"
          />
        </div>
      ))}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {generData.length > 0 ? (
          generData.map((product) => (
            <Link to={`/product-detail/${product.id}`} key={product.id}>
              <div className="group relative border border-gray-200 p-3 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-100 group-hover:opacity-90">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Discount:{" "}
                      <span className="text-green-600 font-medium">
                        {product.discountPercentage}% off
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₹
                      {Math.floor(
                        product.price -
                          product.price * (product.discountPercentage / 100)
                      )}
                    </p>
                    <p className="text-xs line-through text-gray-400">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
                {product.deleted && (
                  <p className="text-xs text-red-500 mt-1">Product deleted</p>
                )}
                {product.stock <= 0 && (
                  <p className="text-xs text-orange-500 mt-1">Coming Soon</p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found for this genre.
          </p>
        )}
      </div>

      {loading && (
        <div className="flex justify-center mt-4">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      )}
      <div ref={observerRef}></div>
    </div>
  );
};
