import { useState, useEffect, useCallback,useRef } from 'react';
import { fetchCategoryProductAsync } from '../productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import NavigationBar from './NavigationBar';
export default function WomenHoddiesCreackneak() {
   const [data, setData] = useState([]);
    const [totalpage, setTotalpages] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const loader = useRef(null);
    let subcategories="Classic Fit";
    let gender="Female"
  
    const dispatch = useDispatch();
  
    const getDeatils = useCallback(async () => {
      if (loading || page > totalpage) return; 
  
      setLoading(true);
      try {
        let result = await dispatch(fetchCategoryProductAsync({ page,subcategories,gender })).unwrap();
        setData((prevData) => [...prevData, ...result.products.docs]);
        setTotalpages(result?.totalItems);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    }, [dispatch, page, loading, totalpage]);
  
    useEffect(() => {
      getDeatils();
    }, [getDeatils]);
  
    const handleObserver = useCallback(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && page <= totalpage) {
          setPage((prev) => prev + 1); // Only increment if not loading
        }
      },
      [loading, page, totalpage]
    );
  
    useEffect(() => {
      const observer = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '20px',
        threshold: 1.0,
      });
  
      if (loader.current) {
        observer.observe(loader.current);
      }
  
      return () => {
        if (loader.current) {
          observer.unobserve(loader.current);
        }
      };
    }, [handleObserver]);
  
    return (
      <>
        <div className="h-[100%]">
          <NavigationBar />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Category%20wallpepar%2FCLASSIC%20WOMEN.jpg?alt=media&token=1cc64524-9377-4810-89af-fad7a491c7a6"
          />
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="w-[100%] h-[100%] flex justify-center item center">
          <div className="grid grid-cols-2 gap-4 md:gap-8 p-3 sm:grid-cols-4 w-[100%] md:w-[70%] md:h-[100%] text-xs md:justify-end font-poppins md:px-10 md:text-lg">
            {data?.map((product) => (
              <Link to={`/product-detail/${product.id}`} key={product.id}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="object-cover w-full h-56 mb-4 md:h-[55vh]"
                />
                <div className="flex flex-col px-3 justify-between h-[12vh]">
                  <p className="text-[#4f5362] text-[10px] font-semibold font-sans">Shamaim</p>
                  <p className="text-[#737373] text-[8px] font-serif">
                    {product.AboutTheDesign.slice(0, 30).concat('...')}
                  </p>
                  <div className="flex">
                    <p className="text-xs">
                      ₹{Math.floor(product.price - product.price * (product.discountPercentage / 100))}
                    </p>
                    <p className="px-1.5 text-[#949494] text-sm font-light font-serif line-through ">
                      ₹{product.price}
                    </p>
                  </div>
                  <div className="w-[90%] text-[7px] font-semibold py-0.5 text-center text-[#737373] border border-[#737373] border-1">
                    <p>LIGHTWEIGHT TERRY FABRIC</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
  
        {loading && <p className="text-center">Loading...</p>}
        <div ref={loader} />
      </>
    );
}
