import { Link } from "react-router-dom";
import { baseUrl, getGuestUserId } from "../app/constants";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from "../features/cart/cartSlice";
import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateUserAsync } from "../features/user/userSlice";
import { useState } from "react";
import {
  createOrderAsync,
  selectCurrentOrder,
  selectStatus,
} from "../features/order/orderSlice";
import { selectUserInfo } from "../features/user/userSlice";
import { Grid } from "react-loader-spinner";
import { useAlert } from "react-alert";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { AppContext } from "../app/Context";

function Checkout() {
  // shipping order ship rocket

  //payment
  const [orderId, setOrderId] = useState("");
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { updateCart, logout } = useContext(AppContext);

  const user = useSelector(selectUserInfo);
  const items = useSelector(selectItems);
  const status = useSelector(selectStatus);
  const currentOrder = useSelector(selectCurrentOrder);
  const [cuponCode, setcuponCode] = useState(null);
  const alert = useAlert();

  const [totalAmount, setTotalAmount] = useState(0); // State to hold total amount

  const [loader, setLoader] = useState(false);

  const [cart, setCart] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

  const [isCouponApplied, setIsCouponApplied] = useState(false);


  useEffect(() => {
    // Calculate initial total amount when items change

    const initialTotalAmount = calculateTotalAmount(items);
    setTotalAmount(initialTotalAmount);
  }, [items]);

  const handleClick = () => {
    if (cuponCode && cuponCode.length > 0) {
      if (cuponCode === 'FORYOU100') {
        alert.success("Coupon applied sucessfully");
        if (getGuestUserId()) {
          setTotalAmount(totalAmount - 100);
          setIsCouponApplied(true);
        } else {
          const initialTotalAmount = calculateTotalAmount(items);
          setTotalAmount(initialTotalAmount - 100);
          setIsCouponApplied(true);
        }
      }
      else {
        alert.error("Coupon code is invalid");
        setIsCouponApplied(false);
      }
    }
    else {
      alert.error("Can't apply empty coupon code!");
      setIsCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setIsCouponApplied(false);
    setcuponCode(null);
    if (getGuestUserId()) {
      fetchCart();
    } else {
      const initialTotalAmount = calculateTotalAmount(items);
      setTotalAmount(initialTotalAmount - 100);
    }
  }

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
    totalItems = items.reduce((total, item) => item.quantity + total, 0);
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

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // const handleQuantity = (e, item) => {
  //   dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  // };

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
      if (items.length === 0) {
        navigation("/");
      }
    }
  };

  const handleAddress = (e) => {
    setSelectedAddress(user.addresses[e.target.value]);
  };

  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  const clearUserCart = async () => {
    try {
      const res = await axios.put(`${baseUrl}/api/clearCart/${getGuestUserId()}`);
      alert.success(res.data.message);
    } catch (error) {
      alert.error(error.response.data.message);
    }
  };

  const createOrder = async (e) => {

    if (getGuestUserId()) {
      if (guestAddress && paymentMethod) {

        const order = {
          firstName: guestAddress.name.split(" ")[0] || "",
          lastName: guestAddress.name.split(" ")[1] || "",
          addressLine1: guestAddress.address?.street,
          addressLine2: "",
          city: guestAddress.address?.city,
          pincode: guestAddress.address?.pinCode,
          state: guestAddress.address?.state,
          email: guestAddress.email,
          phone: guestAddress.address?.phone,
          items: cart.map((item) => ({
            id: item.productId.id,
            sku: item.productId.id,
            name: item.productId.title,
            units: item.qty,
            selling_price: (Math.floor(item.productId.price - item.productId.price * (item.productId.discountPercentage / 100)
            )),
            thumbnail: item.productId.thumbnail,
            selectedAddress: {
              name: guestAddress.name,
              email: guestAddress.email,
              phone: guestAddress.address?.phone,
              street: guestAddress.address?.street,
              city: guestAddress.address?.city,
              state: guestAddress.address?.state,
              pinCode: guestAddress.address?.pinCode
            },
            quantity: item.qty,
            size: item.size,
            productid: item.productId.id,
          })),
          paymentDetails: { payMode: "COD" },
          user: getGuestUserId(),
          totalItems: cart.length,
          totalAmount: totalAmount,
          paymentMethod: "cash"
        };

        dispatch(createOrderAsync(order));

        await clearUserCart();

        navigation(`/order-success/${getGuestUserId()}`);

      } else {
        alert.error("Enter Address and Payment method");
      }
    } else {
      if (selectedAddress && paymentMethod) {

        const order = {
          firstName: selectedAddress.name.split(" ")[0] || "",
          lastName: selectedAddress.name.split(" ")[1] || "",
          addressLine1: selectedAddress.street,
          addressLine2: "",
          city: selectedAddress.city,
          pincode: selectedAddress.pinCode,
          state: selectedAddress.state,
          email: selectedAddress.email,
          phone: selectedAddress.phone,
          items: items.map((item) => ({
            id: item.id,
            sku: item.id,
            name: item.product.title,
            units: item.quantity,
            selling_price: (Math.floor(item.product.price - item.product.price * (item.product.discountPercentage / 100)
            )),
            thumbnail: item.product.thumbnail,
            selectedAddress: selectedAddress,
            quantity: totalItems,
            size: item.size,
            productid: item.product.id,
          })),
          paymentDetails: { payMode: "COD" },
          user: user.id,
          totalItems: totalItems,
          totalAmount: totalAmount,
          paymentMethod: "cash"
        };

        dispatch(createOrderAsync(order));
        navigation(`/order-success/${user.id}`);

      } else {
        alert.error("Enter Address and Payment method");
      }
    }
  };

  const initiatePayment = async () => {
    if (getGuestUserId()) {
      if (guestAddress && paymentMethod) {

        try {
          const response = await axios.post(baseUrl + "/orders/create", {
            amount: totalAmount,
          });
          const data = response.data;
          const options = {
            key: "rzp_live_3vTiOMXqTXi6Si",
            amount: data.amount,
            currency: data.currency,
            name: "Shamaim Lifestyle",
            description: "Payment for Order",
            order_id: data.id,
            handler: async function (response) {
              const order = {
                firstName: guestAddress.name.split(" ")[0] || "",
                lastName: guestAddress.name.split(" ")[1] || "",
                addressLine1: selectedAddress.street,
                addressLine2: "",
                city: guestAddress.address?.city,
                pincode: guestAddress.address?.pinCode,
                state: guestAddress.address?.state,
                email: guestAddress.email,
                phone: guestAddress.address?.phone,
                items: cart.map((item) => ({
                  id: item.productId.id,
                  sku: item.productId.id,
                  name: item.productId.title,
                  units: item.qty,
                  selling_price: (Math.floor(item.productId.price - item.productId.price * (item.productId.discountPercentage / 100)
                  )),
                  thumbnail: item.productId.thumbnail,
                  selectedAddress: {
                    name: guestAddress.name,
                    email: guestAddress.email,
                    phone: guestAddress.address?.phone,
                    street: guestAddress.address?.street,
                    city: guestAddress.address?.city,
                    state: guestAddress.address?.state,
                    pinCode: guestAddress.address?.pinCode
                  },
                  quantity: item.qty,
                  size: item.size
                })),
                paymentDetails: { payMode: "card" },
                user: getGuestUserId(),
                totalItems: cart.length,
                totalAmount: totalAmount,
                paymentMethod: "online"
              };

              dispatch(createOrderAsync(order));

              await clearUserCart();

              navigation(`/order-success/${getGuestUserId()}`);
            },
            prefill: {
              name: guestAddress.name,
              email: guestAddress.email,
              contact: guestAddress.address?.phone,
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } catch (error) {
          console.error("Error creating order:", error);
        }
      } else {
        alert.error("Enter Address and Payment method");
      }
    } else {
      if (selectedAddress && paymentMethod) {

        try {
          const response = await axios.post(baseUrl + "/orders/create", {
            amount: totalAmount,
          });
          const data = response.data;
          // setOrderId(data.id);
          const options = {
            key: "rzp_live_3vTiOMXqTXi6Si",
            amount: data.amount,
            currency: data.currency,
            name: "Shamaim Lifestyle",
            description: "Payment for Order",
            order_id: data.id,
            handler: async function (response) {
              const order = {
                firstName: selectedAddress.name.split(" ")[0] || "",
                lastName: selectedAddress.name.split(" ")[1] || "",
                addressLine1: selectedAddress.street,
                addressLine2: "",
                city: selectedAddress.city,
                pincode: selectedAddress.pinCode,
                state: selectedAddress.state,
                email: selectedAddress.email,
                phone: selectedAddress.phone,
                items: items.map((item) => ({
                  id: item.id,
                  sku: item.id,
                  name: item.product.title,
                  units: item.quantity,
                  selling_price: (Math.floor(item.product.price - item.product.price * (item.product.discountPercentage / 100)
                  )),
                  thumbnail: item.product.thumbnail,
                  selectedAddress: selectedAddress,
                  quantity: totalItems,
                  size: item.size
                })),
                paymentDetails: { payMode: "card" },
                user: user.id,
                totalItems: totalItems,
                totalAmount: totalAmount,
                paymentMethod: "online"
              };

              let res = await dispatch(createOrderAsync(order));
              navigation(`/order-success/${user.id}`);
            },
            prefill: {
              name: selectedAddress.name,
              email: selectedAddress.email,
              contact: selectedAddress.phone,
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } catch (error) {
          console.error("Error creating order:", error);
        }
      } else {
        alert.error("Enter Address and Payment method");
      }
    }
  };

  const [sttate, setState] = useState(false);

  const handleAddresstoogle = () => {
    setState(!sttate);
  }

  const fetchCart = async () => {
    if (getGuestUserId()) {
      setLoader(true);
      try {
        const res = await axios.get(`${baseUrl}/api/getCart/${getGuestUserId()}`);
        setCart(res.data.cart);
        setTotalAmount(res.data.subtotal);
        setLoader(false);
        if (res.data.cart.length === 0) {
          navigation("/");
        }
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

  const [guestAddress, setGuestAddress] = useState({});

  const fetchAddress = async () => {
    if (getGuestUserId()) {
      setLoader(true);
      try {
        const res = await axios.get(`${baseUrl}/api/getGuestAddress/${getGuestUserId()}`);
        setGuestAddress(res.data);
        setLoader(false);
      } catch (error) {
        alert.error(error.response.data.message);
        setLoader(false);
      }
    }
  };

  const saveAddress = async (data) => {
    try {
      const res = await axios.put(`${baseUrl}/api/addAddress/${getGuestUserId()}`, { data: data });
      setGuestAddress(res.data.address);
      alert.success(res.data.message);
    } catch (error) {
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchCart();
    handleIsGuest();
    fetchAddress();
  }, []);

  return (
    <>
      {currentOrder && currentOrder.paymentMethod === "cash" && (
        <Navigate
          to={`/order-success/${currentOrder.id}`}
          replace={true}
        ></Navigate>
      )}
      {currentOrder && currentOrder.paymentMethod === "card" && (
        <Navigate to={`/stripe-checkout/`} replace={true}></Navigate>
      )}

      {status === "loading" || loader ? (
        <div className="w-full flex items-center justify-center mt-32">
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
      ) : (
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 mt-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="pb-6 border-b border-gray-900/10">
                <h2 className="text-base font-semibold leading-7 text-gray-900 ">
                  Addresses
                </h2>
                <p className="my-1 text-sm leading-6 text-gray-600">
                  {isGuest ? Object.keys(guestAddress).length != 0 ? <div className="w-full h-[2px] bg-gray-900/10 my-2"></div> : 'Please add address to continue' : 'Choose from Existing addresses'}
                </p>
                <ul>
                  {
                    isGuest ?
                      Object.keys(guestAddress).length != 0 &&
                      <div className="flex flex-col items-start justify-start gap-0.5 font-medium">
                        <div className="text-sm font-medium mb-1">Shipping to,</div>
                        <div>Name: <span className="text-gray-600">{guestAddress.name}</span></div>
                        <div>Email: <span className="text-gray-600">{guestAddress.email}</span></div>
                        <div>Address: <span className="text-gray-600">{guestAddress.address?.street}, {guestAddress.address?.city}, {guestAddress.address?.state} - {guestAddress.address?.pinCode}</span></div>
                        <div>Phone No.: <span className="text-gray-600">+91-{guestAddress.address?.phone}</span></div>
                      </div>
                      :
                      !user?.addresses ? <div className="my-2 text-sm text-gray-800 font-medium">No saved address found!</div> :
                        user?.addresses?.map((address, index) => (
                          <li
                            key={index}
                            className="flex justify-between px-5 py-5 border-2 border-gray-200 border-solid gap-x-6"
                          >
                            <div className="flex gap-x-4">
                              <input
                                onChange={handleAddress}
                                name="address"
                                type="radio"
                                value={index}
                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                              />
                              <div className="flex-auto min-w-0">
                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                  {address.name}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-gray-500 truncate">
                                  {address.street}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-gray-500 truncate">
                                  {address.pinCode}
                                </p>
                              </div>
                            </div>
                            <div className="hidden sm:flex sm:flex-col sm:items-end">
                              <p className="text-sm leading-6 text-gray-900">
                                Phone: {address.phone}
                              </p>
                              <p className="text-sm leading-6 text-gray-500">
                                {address.city}
                              </p>
                            </div>
                          </li>
                        ))
                  }
                </ul>

                {/* button add address */}

                <button onClick={handleAddresstoogle}
                  className={`px-3 py-2 mt-4 font-normal text-white rounded-md ${Object.keys(guestAddress).length != 0 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-700 hover:bg-blue-800'}`}>
                  {isGuest ? Object.keys(guestAddress).length != 0 ? 'Edit' : 'Add' : 'Add'} address
                </button>
              </div>
              {/* This form is for address */}
              {sttate &&
                <form
                  className="px-5 py-12 mt-6 bg-white"
                  noValidate
                  onSubmit={handleSubmit((data) => {
                    if (getGuestUserId()) {
                      saveAddress(data);
                    } else {
                      dispatch(
                        updateUserAsync({
                          ...user,
                          addresses: [...user.addresses, data],
                        })
                      );
                    }
                    reset();
                    handleAddresstoogle();
                  })}
                >

                  <div className="space-y-12">
                    <div className="pb-12 border-b border-gray-900/10">
                      <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                        Personal Information
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Use a permanent address where you can receive mail.
                      </p>

                      <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Full name
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("name", {
                                required: "name is required",
                              })}
                              id="name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.name && (
                              <p className="text-red-500">
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Email address
                          </label>
                          <div className="mt-2">
                            <input
                              id="email"
                              {...register("email", {
                                required: "email is required",
                              })}
                              type="email"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.email && (
                              <p className="text-red-500">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Phone
                          </label>
                          <div className="mt-2">
                            <input
                              id="phone"
                              {...register("phone", {
                                required: "phone is required",
                              })}
                              type="tel"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.phone && (
                              <p className="text-red-500">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="street-address"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Street address
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("street", {
                                required: "street is required",
                              })}
                              id="street"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.street && (
                              <p className="text-red-500">
                                {errors.street.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            City
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("city", {
                                required: "city is required",
                              })}
                              id="city"
                              autoComplete="address-level2"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.city && (
                              <p className="text-red-500">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            State / Province
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("state", {
                                required: "state is required",
                              })}
                              id="state"
                              autoComplete="address-level1"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.state && (
                              <p className="text-red-500">
                                {errors.state.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="pinCode"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            ZIP / Postal code
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("pinCode", {
                                required: "pinCode is required",
                              })}
                              id="pinCode"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.pinCode && (
                              <p className="text-red-500">
                                {errors.pinCode.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-6 gap-x-6">
                      <button onClick={handleAddresstoogle}
                        className="text-sm font-semibold leading-6 text-red-600">Close</button>
                      <button
                        // onClick={e=>reset()}
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add Address
                      </button>
                    </div>
                  </div>

                </form>
              }

              {/* payment method */}
              <div className="my-10 space-y-10">
                <fieldset>
                  <legend className="text-sm font-semibold leading-6 text-gray-900">
                    Payment Methods
                  </legend>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Choose One
                  </p>
                  <div className="mt-6 space-y-6">

                    <div className="flex items-center gap-x-3">
                      <input
                        id="cash"
                        name="payments"
                        onChange={handlePayment}
                        value="cash"
                        type="radio"
                        checked={paymentMethod === "cash"}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="cash"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Cash
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="card"
                        onChange={handlePayment}
                        name="payments"
                        checked={paymentMethod === "card"}
                        value="card"
                        type="radio"
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="card"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Card Payment
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="card"
                        onChange={handlePayment}
                        name="payments"
                        checked={paymentMethod === "card"}
                        value="card"
                        type="radio"
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="card"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Wallet Payment
                      </label>
                    </div>
                    <div className="flex items-center gap-x-3">
                      <input
                        id="card"
                        onChange={handlePayment}
                        name="payments"
                        checked={paymentMethod === "card"}
                        value="card"
                        type="radio"
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="card"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        UPI Payment
                      </label>
                    </div>
                  </div>
                </fieldset>
              </div>

            </div>
            <div className="lg:col-span-2">
              <div className="px-2 mx-auto bg-white max-w-7xl sm:px-2 lg:px-4">
                <div className="px-0 pb-6 border-t border-gray-200 sm:px-0">
                  <h1 className="my-5 text-4xl font-bold tracking-tight text-gray-900">
                    Cart
                  </h1>
                  {
                    isGuest ?
                      <div className='w-full flex flex-col items-center justify-start gap-10'>
                        {
                          cart.length === 0 ? <div className='w-full text-left text-gray-500'>Your cart is empty!</div> :
                            cart.map(item => {
                              return (
                                <div className='w-full flex items-start justify-between gap-4'>
                                  <div className='flex items-center justify-center gap-4'>
                                    <Link to={`/product-detail/${item.productId.id}`}>
                                      <img src={item.productId.thumbnail} alt='Image' className='w-24 h-24 object-cover object-center rounded-md border border-gray-200' />
                                    </Link>
                                    <div className='flex flex-col items-start justify-between gap-2'>
                                      <div className='flex flex-col items-start justify-start gap-1'>
                                        <div className='font-medium text-gray-900 truncate max-w-[15rem]'>{item.productId.title}</div>
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

                                    <div onClick={(e) => handleRemove(e, item._id)}
                                      className='text-sm text-indigo-600 hover:text-indigo-500 font-semibold cursor-pointer'>Remove</div>
                                  </div>
                                </div>
                              )
                            })
                        }
                      </div>
                      :
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {
                            items.length > 0 ?
                              items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md ">
                                    <img
                                      src={item.product.thumbnail}
                                      alt={item.product.title}
                                      className="object-cover object-center w-full h-full"
                                    />
                                  </div>

                                  <div className="flex flex-col flex-1 ml-4">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href={item.product.id}>
                                            {item.product.title}
                                          </a>
                                        </h3>
                                        <p className="ml-4">
                                          ₹{Math.floor(item.product.price - item.product.price * (item.product.discountPercentage / 100))}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {item.product.brand}
                                      </p>
                                    </div>
                                    <div className="flex items-end justify-between flex-1 text-sm">
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
                                        <button
                                          onClick={(e) => handleRemove(e, item.id)}
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
                      </div>
                  }
                </div>

                <div className="px-2 py-6 border-t border-gray-200 sm:px-2">
                  {
                    isCouponApplied ?
                      <div className="w-full flex flex-col items-start justify-center gap-1">
                        <div className="w-full flex items-center justify-between">
                          <div className="text-gray-500 font-medium">{cuponCode}</div>
                          <IoMdCloseCircleOutline className="text-xl text-red-600 cursor-pointer" onClick={removeCoupon} />
                        </div>
                        <div className="text-green-600 italic text-xs">*Coupon code is applied successfully.</div>
                      </div>
                      :
                      <div className="flex items-center justify-center gap-3 ">
                        <input type="text" value={cuponCode} onChange={(e) => setcuponCode(e.target.value)} className="p-2 rounded-lg w-[90vw]" placeholder="Enter your coupon code here..." />
                        <p className="text-lg bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-4 rounded-lg cursor-pointer" onClick={handleClick}>Apply</p>
                      </div>
                  }
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900 mt-6">
                    <p>Subtotal</p>
                    <p> {INR.format(totalAmount)}</p>
                  </div>
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Total Items in Cart</p>
                    <p>{totalItems} items</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <div
                      onClick={
                        paymentMethod === "cash" ? createOrder : initiatePayment
                      }
                      className="flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm cursor-pointer hover:bg-indigo-700"
                    >
                      Order Now
                    </div>
                  </div>
                  <div className="flex justify-center mt-6 text-sm text-center gap-2 text-gray-500">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
