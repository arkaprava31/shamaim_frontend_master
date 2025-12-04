import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchLoggedInUserOrderAsync, fetchproductorderbyidAsync } from '../userSlice';
import { GrNext } from "react-icons/gr";
import { Link } from 'react-router-dom';


export default function UserOrders() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    let res = await dispatch(fetchLoggedInUserOrderAsync()).unwrap();
    setOrders(res);
  }

  const handlemore = async (orderid) => {
    const data = await dispatch(fetchproductorderbyidAsync(orderid)).unwrap();
  }

  const formatDate = (createdAt) => {
    let date = new Date(createdAt);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  }

  return (
    <div className='mt-10'>
      <div className='bg-white shadow rounded-t-lg w-full h-12 mb-3'>
        <p className='text-center py-2'>My Orders</p>
      </div>
      {orders ? orders.map((order) => (

        <Link to={`/orders-details/${order.id}`} key={order.id} className="order-card  mb-0.5 bg-white rounded-lg  flex items-center justify-between py-8 p-2 text-sm sm:text-lg">
          <img src={order.items[0].thumbnail} alt={order.items[0].name} className="order-image w-16 h-16 rounded-md " />
          <div className="order-details flex-1 pl-4 ">
            <p className="order-date text-gray-600">Order On {formatDate(order.createdAt)}</p>
            <p className="order-id text-gray-8  font-semibold">Order ID: {order.id}</p>
            <div className="order-item">
              <p className="order-item-name text-gray-800">{(order.items[0].name).slice(0,40).concat('...')}</p>
            </div>
            <div className=' text-gray-700 shadow-2xl bg-red-800 w-1'>
            <hr/>
            </div>
          </div>
          <GrNext  size={16}/>
        </Link>
      )):<p className=' text-lg font-semibold text-red-800'>Continue Shoping</p>}
    </div>
  );
}
