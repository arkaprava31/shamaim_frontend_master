import { useState, useEffect, useCallback,useRef } from 'react';
import { fetchProductCrewNeakAsync } from '../productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
export default function CrewneckProduct() {
  const [data, setData] = useState([]);
  const [totalpage,setTotalpages]=useState();
  const[loading,setLoading]=useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const dispatch = useDispatch();


  const getDeatils=useCallback(async()=>{
   setLoading(true);
    try{
    let data=await dispatch(fetchProductCrewNeakAsync({page})).unwrap();
    setData((fetchdata)=>[...fetchdata,...data.products.docs]);
    setTotalpages(data?.products?.totalDocs);
  }
    catch(err){
      setLoading(false);
    }
    finally{
      setLoading(false)
    }
  },[dispatch,page])

  useEffect(() => {
    getDeatils();
  }, [getDeatils]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
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
    <div className=' h-[100%]'>
  <img src='https://firebasestorage.googleapis.com/v0/b/shamaim-lifestyle.appspot.com/o/Category%20wallpepar%2FMen%20Crewneck.png?alt=media&token=c7e0cf86-b491-4d7f-be59-b2cd32849c11'/>
 </div>
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className=" w-[100%] h-[100%] flex  justify-center item center ">
      <div className="grid grid-cols-2 gap-4 md:gap-8 p-3 sm:grid-cols-4 w-[100%] md:w-[70%] md:h-[100%] text-xs md:justify-end   font-poppins  md:px-10 md:text-lg">
        {data?.map((product) => (
          <Link to={`/product-detail/${product.id}`} key={product.id}>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="object-cover w-full h-56 mb-4 md:h-[55vh]"
            />
            <div className=' flex flex-col px-3 justify-between h-[12vh]'>
            <p className=" text-[#4f5362] text-[10px]  font-semibold font-sans">Shamaim</p>
            <p className="text-[#737373] text-[8px]  font-serif ">
              {product.AboutTheDesign.slice(0, 30).concat('...')}
            </p>
            <div className="flex">
              <p className="  text-xs ">
                ₹{Math.floor(product.price - product.price * (product.discountPercentage / 100))}
              </p>
              <p className="px-1.5 text-[#949494] text-sm  font-light font-serif   line-through ">₹{product.price}</p>
            </div>
            <div className="w-[90%]  text-[7px] font-semibold  py-0.5 text-center text-[#737373] border border-[#737373] border-1">
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
