import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItemFromCartAsync,
  selectCartLoaded,
  selectCartStatus,
  fetchItemsByUserIdAsync,
  selectItems,
  updateCartAsync,
} from './cartSlice';
import { Link, Navigate } from 'react-router-dom';
import { Grid } from 'react-loader-spinner';
import Modal from '../common/Modal';
import { baseUrl, getGuestUserId, getId } from '../../app/constants';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { AppContext } from '../../app/Context';

export default function Cart() {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { updateCart, updateLoggedInCart } = useContext(AppContext);

  const items = useSelector(selectItems);
  const status = useSelector(selectCartStatus);
  const cartLoaded = useSelector(selectCartLoaded);
  const [openModal, setOpenModal] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); // State to hold total amount

  const [cart, setCart] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // Calculate initial total amount when items change
    const initialTotalAmount = calculateTotalAmount(items);
    setTotalAmount(initialTotalAmount);
  }, [items]);

  const calculateTotalAmount = (items) => {
    if (items.length > 0) {
      return items.reduce(
        (amount, item) =>
          amount +
          (Math.floor(item.product.price - item.product.price * (item.product.discountPercentage / 100)
          ) *
            item.quantity),
        0
      );
    } else {
      return 0;
    }
  };

  var totalItems = 0;

  if (getGuestUserId()) {
    totalItems = cart.length;
  } else {
    if(items.length>0){
      totalItems = items.reduce((total, item) => item.quantity + total, 0);
    }
   
  }

  const handleQuantity = (e, item) => {
    const newQuantity = +e.target.value;
    dispatch(updateCartAsync({ id: item.id, quantity: newQuantity }));

    // Recalculate total amount when quantity changes
    const updatedTotalAmount = calculateTotalAmount(
      items.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
      )
    );
    setTotalAmount(updatedTotalAmount);
  };

  const handleRemove = async (e, id) => {
    if (getGuestUserId()) {
      try {
        const res = await axios.put(`${baseUrl}/api/removeCartItem/${getGuestUserId()}/${id}`);
        alert.success(res.data.message);
        fetchCart();
        updateCart();
      } catch (error) {
        alert.error(error.response.data.message);
      }
    } else {
      dispatch(deleteItemFromCartAsync(id));
      updateLoggedInCart(items);
    }
  };

  useEffect(() => {
    dispatch(fetchItemsByUserIdAsync());
  }, [dispatch]);

  const id = getId();

  const fetchCart = async () => {
    if (getGuestUserId()) {
      setLoader(true);
      try {
        const res = await axios.get(`${baseUrl}/api/getCart/${getGuestUserId()}`);
        setCart(res.data.cart);
        setTotalAmount(res.data.subtotal);
        setLoader(false);
      } catch (error) {
        alert.error(error.response.data.message);
        setLoader(false);
      }
    }
  };

  const handleIsGuest = () => {
    if (getGuestUserId()) {
      setIsGuest(true);
    } else {
      setIsGuest(false);
    }
  };

  useEffect(() => {
    fetchCart();
    handleIsGuest();
  }, []);

  const qtyOptions = [1, 2, 3, 4, 5];

  let INR = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  });

  const handleQtyChange = async (e, _id) => {
    try {
      await axios.put(`${baseUrl}/api/updateCartQty/${getGuestUserId()}/${_id}`, { qty: e.target.value });
      fetchCart();
    } catch (error) {
      alert.error(error.response.data.message);
    }
  };

  return (
    <>
      {/* {id ? cartLoaded : <Navigate to="/login" replace={true}></Navigate>}
      {!items.length && cartLoaded && <Navigate to="/" replace={true}></Navigate>} */}

      <div>
        <div className="mx-auto  bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
            <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
              Cart
            </h1>
            <div className="flow-root">
              {status === 'loading' || loader ?
                <div className="w-full flex items-center justify-center my-8">
                  <Grid
                    height="80"
                    width="80"
                    color="rgb(79, 70, 229) "
                    ariaLabel="grid-loading"
                    radius="12.5"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
                :
                <div className='w-full flex flex-col items-center justify-start gap-6'>
                  {
                    isGuest || items.length<0 ?
                      <div className='w-full flex flex-col items-center justify-start gap-10'>
                        {
                          cart.length === 0 ? <div className='w-full text-left text-gray-500'>Your cart is empty!</div> :
                            cart.map(item => {
                              return (
                                <div className='w-full flex items-start justify-between'>
                                  <div className='flex items-center justify-center gap-4'>
                                    <Link to={`/product-detail/${item.productId.id}`}>
                                      <img src={item.productId.thumbnail} alt='Image' className='w-24 h-24 object-cover object-center rounded-md border border-gray-200' />
                                    </Link>
                                    <div className='flex flex-col items-start justify-between gap-2'>
                                      <div className='flex flex-col items-start justify-start gap-1'>
                                        <div className='font-medium text-gray-900'>{item.productId.title}</div>
                                        <div className='text-sm text-gray-500'>Size: {item.size.name}</div>
                                      </div>
                                      <div className='flex items-center justify-center gap-1'>
                                        <div className='text-sm font-medium leading-6 text-gray-900'>Qty:</div>
                                        <select value={item.qty} onChange={(e) => handleQtyChange(e, item._id)}
                                          className='outline-none'>
                                          {
                                            qtyOptions.map(opt => {
                                              return (
                                                <option value={opt}>{opt}</option>
                                              )
                                            })
                                          }
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  <div className='flex flex-col items-end justify-between gap-10'>
                                    <div className='font-medium'>{INR.format(item.qty * item.price)}</div>

                                    <Modal
                                      title={`Delete ${item.productId.title}`}
                                      message="Are you sure you want to delete this Cart item ?"
                                      dangerOption="Delete"
                                      cancelOption="Cancel"
                                      dangerAction={(e) => handleRemove(e, item._id)}
                                      cancelAction={() => setOpenModal(null)}
                                      showModal={openModal === item._id}
                                    ></Modal>

                                    <div onClick={() => setOpenModal(item._id)}
                                      className='text-sm text-indigo-600 hover:text-indigo-500 font-semibold cursor-pointer'>Remove</div>
                                  </div>
                                </div>
                              )
                            })
                        }
                      </div> :
                      <ul className="-my-6 divide-y divide-gray-200 w-full">
                        {
                          items.length > 0 ?
                            items?.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <Link to={`/product-detail/${item.product?.id}`} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.product.thumbnail}
                                    alt={item.product.title}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </Link>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link to={`/product-detail/${item.product?.id}`}>{item.product.title}</Link>
                                      </h3>
                                      ₹{Math.floor(item.product.price - item.product.price * (item.product.discountPercentage / 100))}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {item.product.brand}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      Sizes: {item.size.name}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="text-gray-500">
                                      <label
                                        htmlFor="quantity"
                                        className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                                      >
                                        Qty
                                      </label>
                                      <select
                                        onChange={(e) => handleQuantity(e, item)}
                                        value={item.quantity}
                                      >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                      </select>
                                    </div>

                                    <div className="flex">
                                      <Modal
                                        title={`Delete ${item.product.title}`}
                                        message="Are you sure you want to delete this Cart item ?"
                                        dangerOption="Delete"
                                        cancelOption="Cancel"
                                        dangerAction={(e) => handleRemove(e, item.id)}
                                        cancelAction={() => setOpenModal(null)}
                                        showModal={openModal === item.id}
                                      ></Modal>
                                      <button
                                        onClick={(e) => {
                                          setOpenModal(item.id);
                                        }}
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )) : <div className='my-4 text-gray-500'>Your cart is empty!</div>
                        }
                      </ul>
                  }
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6 w-full">
                    <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>{INR.format(totalAmount)}</p>
                    </div>
                    <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                      <p>Total Items in Cart</p>
                      <p>{totalItems} items</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/checkout"
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                      >
                        Checkout
                      </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-center gap-2 text-sm text-gray-500">
                      <div>or</div>
                      <Link to="/">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
