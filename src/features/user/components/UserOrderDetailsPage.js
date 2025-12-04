import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import {
  returnUserOrderAsync,
  fetchproductorderbyidAsync,
  fetchorderbyidAsync,
  selectProductStatus
} from "../userSlice";

export default function UserOrdersDetailspage() {
  const productStatus = useSelector(selectProductStatus);
  const dispatch = useDispatch();
  const { id: orderId } = useParams();
  const [orders, setOrders] = useState(null);
  const [checkbox, setCheckbox] = useState({});
  const [selectQuantity, setSelectQuantity] = useState({});
  const [returnStatuses, setReturnStatuses] = useState({});
  const [returndescription,setreturndesription]=useState(false);
  const alert = useAlert();

  const awbNumber = productStatus?.data?.shipments?.awb;
  const productsCurrentStatus = productStatus?.data?.shipments?.status;

  const getProduct = () => {
    dispatch(fetchproductorderbyidAsync(orderId)).unwrap();
  };

  const getOrders = async () => {
    const data = await dispatch(fetchorderbyidAsync(orderId)).unwrap();
    setOrders(data);
    // Set initial return statuses from the fetched data
    const initialReturnStatuses = {};
    data.items.forEach(item => {
      initialReturnStatuses[item.id] = item.orderStatus === 'returned';
    });
    setReturnStatuses(initialReturnStatuses);
  };

  useEffect(() => {
    getProduct();
    getOrders();
  }, []);

  const handleClickReturn = async (productId) => {
 alert.show("you can return your product after 3 days of order")
    // await returnOrder(productId);
  };

  const handleCheck = (orderItemId) => {
    setCheckbox(prev => ({
      ...prev,
      [orderItemId]: !prev[orderItemId],
    }));
  };

  const returnOrder = async (productId) => {
    if (!orders) return;

    const selectedItems = orders.items.filter(item => checkbox[item.id]);

    const order = {
      firstName: orders.items[0]?.selectedAddress?.name?.split(" ")[0] || "",
      lastName: orders.items[0]?.selectedAddress?.name?.split(" ")[1] || "",
      addressLine1: orders.items[0]?.selectedAddress?.street,
      addressLine2: "",
      city: orders.items[0]?.selectedAddress?.city,
      pincode: orders.items[0]?.selectedAddress?.pinCode,
      state: orders.items[0]?.selectedAddress?.state,
      email: orders.items[0]?.selectedAddress?.email,
      phone: orders.items[0]?.selectedAddress?.phone,
      orderid: orderId,
      items: selectedItems.map((item) => ({
        id: item.id,
        sku: item.id,
        name: item.name,
        units: selectQuantity[item.id] || 1,
        selling_price: item.selling_price,
        thumbnail: item.thumbnail,
        selectedAddress: item.selectedAddress,
        quantity: selectQuantity[item.id] || 1,
        size: item.size.name,
        productid: item.productid,
      })),
      paymentDetails: { payMode: "COD" },
      user: orders.user,
      totalItems: orders.totalItems,
      totalAmount: orders.totalAmount,
      paymentMethod: "cash",
    };

    await dispatch(returnUserOrderAsync({ order, orderId }))
      .then(() => {
        alert.success('Order returned successfully!');
        setReturnStatuses(prev => ({
          ...prev,
          [productId]: true,
        }));
      })
      .catch(() => {
        alert.error("Item already added");
      });
  };

  const handleChangeQuantity = (itemId, quantity) => {
    setSelectQuantity(prev => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  return (
    <>
      {orders && orders.items.map((order) => (
        <div key={order.id}>
          <div className="relative px-4 mx-auto mt-12 bg-white max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-6 border-t border-gray-200 sm:px-6">
              <h3 className="my-3 ml-4 font-bold tracking-tight text-gray-900 text-md sm:ml-0 sm:text-xl md:text-2xl md:my-5">
                ORDER STATUS: <span className="text-red-800 ">{returnStatuses[order.id]?'Returned': productsCurrentStatus}</span>
              </h3>
              <div className="flow-root">
                <ul className="flex-col -my-6 divide-y divide-gray-200 sm:flex">
                  <li key={order.id} className="flex py-6">
                    <div className="absolute left-3 top-10">
                      <input
                        type="checkbox"
                        checked={checkbox[order.id] || false}
                        className="w-7 h-7"
                        onChange={() => handleCheck(order.id)}
                        disabled={returnStatuses[order.id]} // Disable checkbox if the item is returned
                      />
                    </div>
                    <div className="flex-shrink-0 h-48 overflow-hidden border border-gray-200 rounded-md w-44">
                      <img
                        src={order.thumbnail}
                        alt={order.name}
                        className="object-cover object-center w-full h-full"
                      />
                    </div>
                    <div className="flex-col flex-1 hidden ml-4 md:block">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a href={order.id}>{order.name}</a>
                        </h3>
                        <p className="ml-4">₹{order.selling_price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{order.name}</p>
                      <div className="flex items-end justify-between flex-1 text-sm">
                        <div className="text-gray-500">
                          <select
                            value={selectQuantity[order.id] || 0}
                            onChange={(e) => handleChangeQuantity(order.id, e.target.value)}
                            disabled={returnStatuses[order.id]} // Disable quantity selector if the item is returned
                          >
                            {[...Array(order.quantity).keys()].map(i => (
                              <option value={i + 1} key={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                          <label
                            htmlFor="quantity"
                            className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                          >
                            Qty: {order.quantity}
                          </label>
                        </div>
                        <div className="flex"></div>
                      </div>
                    </div>
                  </li>
                  <div className="flex flex-col flex-1 ml-4 sm:hidden">
                    <p className="mt-1 text-sm text-gray-500">{order.name}</p>
                    <div className="relative flex items-end justify-between flex-1 text-sm">
                      <div className="text-gray-500">
                        <select className="mt-2 mr-2">
                          <option value="1">1</option>
                          <option value="1">1</option>
                        </select>
                        <label
                          htmlFor="quantity"
                          className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                        >
                          Qty: {order.units}
                        </label>
                      </div>
                      <div className="absolute flex justify-between font-medium text-gray-900 text-md right-4 top-5">
                        <p className="ml-4">Total Amount: ₹{order.selling_price * order.units}</p>
                      </div>
                      <div className="flex"></div>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
            <div className="px-4 py-6 border-gray-200 sm:px-6">
              <p className="mt-0.5 text-sm text-gray-500">Pickup Address:</p>
              <div className="flex justify-between px-5 py-5 border-2 border-gray-200 border-solid gap-x-6">
                <div className="flex-auto min-w-0">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{order.selectedAddress.name}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500 truncate">{order.selectedAddress.street}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500 truncate">{order.selectedAddress.pinCode}</p>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">Phone: {order.selectedAddress.phone}</p>
                  <p className="text-sm leading-6 text-gray-500">{order.selectedAddress.city}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between p-4 md:p-6">
              {!returnStatuses[order.id] ? (
                <button
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none`}
                  onClick={() => handleClickReturn(order.id)}
                >
               Return
                </button>
              ) : (
                <span className="px-4 py-2 text-white bg-green-500 rounded-md cursor-not-allowed">Returned</span>
              )}
              {awbNumber ? (
                <button className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none">
                  <a href={`https://shiprocket.co/tracking/${awbNumber}`} target="_blank" rel="noopener noreferrer">
                    Track My Order
                  </a>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
