import { Link } from "react-router-dom";
import { baseUrl, getGuestUserId, getId } from "../app/constants";
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
  createPrepaidOrderAsync,
  selectCurrentOrder,
  selectStatus,
} from "../features/order/orderSlice";
import { selectUserInfo } from "../features/user/userSlice";
import { Grid } from "react-loader-spinner";
import { useAlert } from "react-alert";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { AppContext } from "../app/Context";
import { FaRegEdit } from "react-icons/fa";
import { IoMdRemoveCircleOutline } from "react-icons/io";

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
  const [couponCode, setcouponCode] = useState(null);
  const alert = useAlert();

  const [totalAmount, setTotalAmount] = useState(0); // State to hold total amount

  const [loader, setLoader] = useState(false);

  const [cart, setCart] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [amountBeforeCoupon, setAmountBeforeCoupon] = useState(null);
  const [activeCouponCode, setActiveCouponCode] = useState([]);

  const getActiveCouponCode = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${baseUrl}/constants/getActiveCouponCode`);
      setActiveCouponCode(res.data);
      setLoader(false);
    } catch (error) {
      alert.error(error.response.data.message);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!isGuest) {
      const initialTotalAmount = calculateTotalAmount(items);
      setTotalAmount(initialTotalAmount);
    }
  }, [items]);

  const handleClick = () => {
    if (!couponCode || couponCode.trim().length === 0) {
      alert.error("Can't apply empty coupon code!");
      setIsCouponApplied(false);
      return;
    }

    const matchedCoupon = activeCouponCode.find(
      (coupon) => coupon.code === couponCode.trim()
    );

    if (!matchedCoupon) {
      alert.error("Coupon code is invalid");
      setIsCouponApplied(false);
      return;
    }

    alert.success("Coupon applied successfully");

    const discountAmount = Number(matchedCoupon.amountValue);

    if (getGuestUserId()) {
      setAmountBeforeCoupon(totalAmount);
      setTotalAmount(Math.max(0, totalAmount - discountAmount));
    } else {
      const initialTotalAmount = calculateTotalAmount(items);
      setAmountBeforeCoupon(initialTotalAmount);
      setTotalAmount(Math.max(0, initialTotalAmount - discountAmount));
    }

    setIsCouponApplied(true);
  };

  const removeCoupon = () => {
    setAmountBeforeCoupon(null);
    setIsCouponApplied(false);
    setcouponCode(null);
    if (getGuestUserId()) {
      fetchCart();
    } else {
      setTotalAmount(calculateTotalAmount(items));
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

  // const [paymentMethod, setPaymentMethod] = useState("cash"); // For testing purpose
  const [paymentMethod, setPaymentMethod] = useState("Prepaid"); // default payment method (No COD)

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

  const [guestAddress, setGuestAddress] = useState({});

  const fetchAddress = async () => {
    if (getGuestUserId()) {
      setLoader(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/getGuestAddress/${getGuestUserId()}`
        );
        setGuestAddress(res.data);

        reset({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.address?.phone || "",
          street: res.data.address?.street || "",
          city: res.data.address?.city || "",
          state: res.data.address?.state || "",
          pinCode: res.data.address?.pinCode || "",
        });

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
    getActiveCouponCode();
  }, []);

  // const handleAddress = (e) => {
  //   setSelectedAddress(user.addresses[e.target.value]);
  // };

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  const handleAddress = (e) => {
    const index = Number(e.target.value);
    setSelectedAddressIndex(index);
    setSelectedAddress(user.addresses[index]);
    setFormOpenState(false);
  };

  const handleEditAddress = (index) => {
    const addr = user.addresses[index];

    reset({
      name: addr.name || "",
      email: addr.email || "",
      phone: addr.phone || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pinCode: addr.pinCode || "",
    });

    setSelectedAddressIndex(index);
    setFormOpenState(true);
  };

  const handleRemoveAddress = (index) => {
    try {
      const updatedAddresses = user.addresses.filter((_, i) => i !== index);

      dispatch(
        updateUserAsync({
          ...user,
          addresses: updatedAddresses,
        })
      );

      if (selectedAddressIndex === index) {
        setSelectedAddress(null);
        setSelectedAddressIndex(null);
      }
      setFormOpenState(false);
      alert.success("Shipping details removed successfully!");
    } catch (error) {
      alert.error("Failed to remove shipping details.");
    }
  };


  const clearAddress = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
    });
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
      if (Object.keys(guestAddress).length > 0 && paymentMethod) {

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

        try {
          const savedOrder = await dispatch(createOrderAsync(order)).unwrap();
          navigation(`/order-success/${savedOrder.id}`);
          await clearUserCart();
        } catch (err) {
          console.error("Order failed:", err);
        }
      } else {
        // alert.error("Enter Address and Payment method");
        alert.error("Select Shipping Details to continue");
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

        try {
          const savedOrder = await dispatch(createOrderAsync(order)).unwrap();
          navigation(`/order-success/${savedOrder.id}`);
        } catch (err) {
          console.error("Order failed:", err);
        }

      } else {
        // alert.error("Enter Address and Payment method");
        alert.error("Select Shipping Details to continue");
      }
    }
  };

  // ===============================================================================================

  const createRazorpayOrder = async () => {
    const res = await axios.post(baseUrl + "/orders/create", {
      amount: totalAmount,
    });
    return res.data;
  };

  const openRazorpay = async () => {
    try {
      const razorpayOrder = await createRazorpayOrder();

      const options = {
        key: "rzp_live_3vTiOMXqTXi6Si",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Shamaim Lifestyle",
        order_id: razorpayOrder.id,

        handler: async function (rpResponse) {
          try {
            const orderPayload = {
              firstName: guestAddress.name?.split(" ")[0] || "",
              lastName: guestAddress.name?.split(" ")[1] || "",
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
                quantity: item.qty,
                selling_price: Math.floor(
                  item.productId.price -
                  item.productId.price *
                  (item.productId.discountPercentage / 100)
                ),
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
                size: item.size,
                productid: item.productId.id,
              })),

              paymentMethod: "prepaid",

              paymentDetails: {
                payMode: "Prepaid",
                razorpay_payment_id: rpResponse.razorpay_payment_id,
                razorpay_order_id: rpResponse.razorpay_order_id,
                razorpay_signature: rpResponse.razorpay_signature
              },

              user: getGuestUserId(),
              totalItems: cart.length,
              totalAmount
            };

            const savedOrder = await dispatch(createPrepaidOrderAsync(orderPayload)).unwrap();
            navigation(`/order-success/${savedOrder.id}`);

            await clearUserCart();

          } catch (err) {
            console.error("Prepaid order failed", err);
          }
        },

        prefill: {
          name: guestAddress.name,
          email: guestAddress.email,
          contact: guestAddress.address?.phone,
        },

        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Razorpay init failed:", err);
    }
  };

  const openRazorpayForLoggedIn = async () => {
    try {
      const razorpayOrder = await createRazorpayOrder();

      const options = {
        key: "rzp_live_3vTiOMXqTXi6Si",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Shamaim Lifestyle",
        order_id: razorpayOrder.id,

        handler: async function (rpResponse) {
          try {
            const order = {
              firstName: selectedAddress.name?.split(" ")[0] || "",
              lastName: selectedAddress.name?.split(" ")[1] || "",
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
                quantity: item.quantity,
                selling_price: Math.floor(
                  item.product.price -
                  item.product.price * (item.product.discountPercentage / 100)
                ),
                thumbnail: item.product.thumbnail,
                selectedAddress: selectedAddress,
                size: item.size,
                productid: item.product.id,
              })),

              paymentMethod: "prepaid",

              paymentDetails: {
                payMode: "Prepaid",
                razorpay_payment_id: rpResponse.razorpay_payment_id,
                razorpay_order_id: rpResponse.razorpay_order_id,
                razorpay_signature: rpResponse.razorpay_signature,
              },

              user: user.id,
              totalItems: totalItems,
              totalAmount: totalAmount,
            };

            const savedOrder = await dispatch(createPrepaidOrderAsync(order)).unwrap();
            navigation(`/order-success/${savedOrder.id}`);

          } catch (err) {
            console.error("Prepaid order failed", err);
          }
        },

        prefill: {
          name: selectedAddress?.name,
          email: selectedAddress?.email,
          contact: selectedAddress?.phone,
        },

        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Razorpay init failed:", err);
    }
  };

  const initiatePayment = async () => {
    if (getGuestUserId()) {
      if (Object.keys(guestAddress).length > 0 && paymentMethod) {

        await openRazorpay();

      } else {
        // alert.error("Enter Address and Payment method");
        alert.error("Select Shipping Details to continue");
      }
    } else {
      if (selectedAddress && paymentMethod) {

        try {

          await openRazorpayForLoggedIn();

        } catch (error) {
          console.error("Error creating order:", error);
        }
      } else {
        // alert.error("Enter Address and Payment method");
        alert.error("Select Shipping Details to continue");
      }
    }
  };

  const [formOpenState, setFormOpenState] = useState(false);

  const handleAddresstoogle = () => {
    clearAddress();
    if (getId()) {
      setSelectedAddressIndex(null);
    }
    if (Object.keys(guestAddress).length > 0) {
      reset({
        name: guestAddress.name || "",
        email: guestAddress.email || "",
        phone: guestAddress.address?.phone || "",
        street: guestAddress.address?.street || "",
        city: guestAddress.address?.city || "",
        state: guestAddress.address?.state || "",
        pinCode: guestAddress.address?.pinCode || "",
      });
    }
    setFormOpenState(true);
  };

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

  if (!isGuest) {
    if (items?.length === 0) {
      return <Navigate to="/cart" replace={true}></Navigate>;
    }
  }

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
          <div className="grid grid-cols-1 gap-x-20 gap-y-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className={`${formOpenState ? (Object.keys(guestAddress)?.length === 0 ? 'pb-4' : 'border-b-0') : 'pb-10'} border-b border-gray-900/10`}>
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                  Shipping Details
                </h2>
                <p className="my-1 text-sm leading-6 text-gray-600">
                  {isGuest ? Object.keys(guestAddress).length != 0 ? <div className="w-full h-[2px] bg-gray-900/10 my-4"></div> : 'Please add shipping details to continue' : 'Choose or add your shipping details.'}
                </p>
                <ul>
                  {
                    isGuest ?
                      Object.keys(guestAddress).length != 0 &&
                      <div className="relative w-full lg:max-w-[60%] rounded-xl border border-indigo-200 bg-indigo-50 p-4 mb-2">
                        <div className="mb-2 text-[0.675rem] font-medium text-gray-600">
                          Shipping to,
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {guestAddress.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {guestAddress.address?.street}, {guestAddress.address?.city},{" "}
                            {guestAddress.address?.state} – {guestAddress.address?.pinCode}
                          </p>
                          <p className="text-sm text-gray-600">
                            📧 {guestAddress.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            📞 +91 {guestAddress.address?.phone}
                          </p>
                        </div>
                        {/* Badge */}
                        <span className="absolute top-4 right-4 rounded-full bg-green-100 px-2 py-0.5 pb-1 text-xs font-medium text-green-700">
                          Selected
                        </span>
                      </div>
                      :
                      user?.addresses.length === 0 ? <div className="my-2 text-xs text-gray-800 font-medium">No saved address found!</div> :
                        <div className={`w-full flex flex-col items-start gap-4 my-4`}>
                          {user?.addresses?.map((address, index) => (
                            <li
                              key={index}
                              onClick={() => handleAddress({ target: { value: index } })}
                              className={`w-full lg:max-w-[60%] relative cursor-pointer rounded-xl border p-4 transition-all
                                  ${selectedAddressIndex === index
                                  ? "border-indigo-600 ring-2 ring-indigo-600 bg-indigo-50"
                                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                                }`}
                            >
                              {/* Radio */}
                              <div className="absolute top-4 right-4">
                                <input
                                  type="radio"
                                  name="address"
                                  checked={selectedAddressIndex === index}
                                  onChange={() => handleAddress({ target: { value: index } })}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                />
                              </div>

                              {/* Address content */}
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-900">
                                  {address.name}
                                </p>

                                <p className="text-sm text-gray-600">
                                  {address.street}, {address.city}, {address.state} – {address.pinCode}
                                </p>

                                <p className="text-sm text-gray-600">
                                  📞 +91 {address.phone}
                                </p>
                              </div>

                              <div className="mt-3 flex items-center gap-2.5 text-lg">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAddress(index);
                                  }}
                                  className="font-medium text-indigo-600 hover:underline"
                                >
                                  <FaRegEdit />
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAddress(index);
                                  }}
                                  className="font-medium text-red-600 hover:underline text-xl"
                                >
                                  <IoMdRemoveCircleOutline />
                                </button>
                              </div>
                            </li>
                          ))}
                        </div>
                  }
                </ul>

                {/* button add address */}

                <button onClick={handleAddresstoogle}
                  className={`px-3 py-2 mt-2 text-sm font-normal text-white rounded-md ${Object.keys(guestAddress).length != 0 ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-700 hover:bg-blue-800'} ${formOpenState ? 'hidden' : ''}`}>
                  {isGuest ? (Object.keys(guestAddress).length != 0 ? 'Edit' : 'Add') : (user?.addresses.length === 0 ? 'Add' : 'Add new')} shipping details
                </button>
              </div>
              {/* This form is for address */}
              {formOpenState &&
                <form
                  className="p-6 rounded-lg mt-6 bg-white"
                  noValidate
                  onSubmit={handleSubmit((data) => {
                    if (getGuestUserId()) {
                      saveAddress(data);
                    } else {
                      try {
                        let updatedAddresses = [...user.addresses];
                        if (selectedAddressIndex !== null) {
                          updatedAddresses[selectedAddressIndex] = data;
                        } else {
                          updatedAddresses.push(data);
                        }
                        dispatch(
                          updateUserAsync({
                            ...user,
                            addresses: updatedAddresses,
                          })
                        );
                        alert.success(`Shipping details ${selectedAddressIndex !== null ? 'updated' : 'added'} successfully!`);
                      } catch (error) {

                      }
                    }

                    reset();
                    setSelectedAddressIndex(null);
                    setFormOpenState(false);
                  })}

                >

                  <div className="space-y-12">
                    <div className="">
                      <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                        Your Shipping Details
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600 italic">
                        Use a permanent address to experience a hassle-free delivery!
                      </p>

                      <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Full name*
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("name", {
                                required: "Name is required",
                              })}
                              id="name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.name && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {
                          isGuest && (
                            <div className="sm:col-span-4">
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Email address*
                              </label>
                              <div className="mt-2">
                                <input
                                  id="email"
                                  {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                                      message: "Enter a valid email address",
                                    },
                                  })}
                                  type="email"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {errors.email && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.email.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        }

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Phone Number*
                          </label>
                          <div className="mt-2">
                            <input
                              id="phone"
                              {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                  value: /^[6-9]\d{9}$/,
                                  message: "Enter a valid 10-digit mobile number",
                                },
                              })}
                              type="tel"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.phone && (
                              <p className="text-red-500 text-xs mt-1">
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
                            Address Line*
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("street", {
                                required: "Address line is required",
                              })}
                              id="street"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.street && (
                              <p className="text-red-500 text-xs mt-1">
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
                            City*
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("city", {
                                required: "City is required",
                              })}
                              id="city"
                              autoComplete="address-level2"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.city && (
                              <p className="text-red-500 text-xs mt-1">
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
                            State / Province*
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("state", {
                                required: "State is required",
                              })}
                              id="state"
                              autoComplete="address-level1"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.state && (
                              <p className="text-red-500 text-xs mt-1">
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
                            ZIP / Postal code*
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("pinCode", {
                                required: "ZIP / Postal code is required",
                                pattern: {
                                  value: /^[1-9][0-9]{5}$/,
                                  message: "Enter a valid 6-digit ZIP code",
                                },
                              })}
                              id="pinCode"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.pinCode && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.pinCode.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-x-6">
                      <button onClick={() => setFormOpenState(false)} type="button"
                        className="text-sm font-semibold leading-6 text-red-600">Close</button>
                      <button
                        onClick={() => clearAddress()}
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {selectedAddressIndex !== null || Object.keys(guestAddress)?.length != 0 ? "Update" : "Save"}
                      </button>
                    </div>
                  </div>

                </form>
              }

              {/* payment method */}
              <div className="my-10 space-y-10">
                <fieldset>
                  <legend className="text-2xl font-semibold leading-6 text-gray-900">
                    Mode of Payment
                  </legend>
                  <p className="mt-2 text-sm leading-6 text-gray-600 italic">
                    *Currently, we accept payments via UPI, wallet, debit/credit cards, and net banking. Please ensure that you have selected your shipping address before placing your order.
                  </p>
                  {/* <div className="mt-6 space-y-6">
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
                  </div> */}

                  {/* <div className="w-fit flex items-center justify-start mt-4 gap-2 border-2 border-[#012652] rounded-md p-2 px-4 bg-white">
                    <div className="text-[#0D94FB] text-base font-medium">Pay Securely via UPI, Wallet, Cards & Net Banking through</div>
                    <img src={"razorpay-icon.svg"} alt="razorpay_icon" className="w-24 h-auto object-contain object-center" />
                  </div> */}

                  <div className="relative mt-6 flex items-center gap-5 rounded-2xl border border-indigo-200 bg-white/80 p-5 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.35)] backdrop-blur-md ring-1 ring-indigo-500/30">

                    {/* Selected Pill */}
                    <span className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-1 pb-[0.3125rem] text-xs font-semibold text-white shadow-md">
                      ✓ Selected
                    </span>

                    {/* Accent Bar */}
                    <div className="h-10 w-1 rounded-full bg-gradient-to-b from-indigo-600 to-blue-500" />

                    {/* Text Content */}
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-semibold text-gray-900">
                        Pay securely with Razorpay
                      </p>
                      <p className="text-xs text-gray-600">
                        UPI, Wallets, Cards & Net Banking
                      </p>
                    </div>

                    <img
                      src="razorpay-icon.svg"
                      alt="razorpay"
                      className="ml-auto w-24 opacity-90"
                    />
                  </div>

                </fieldset>
              </div>

            </div>

            <div className="lg:col-span-2">
              <div className="p-4 mx-auto bg-white rounded-lg">
                <div className="">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Order Summary
                  </h1>
                  <div className="w-full bg-gray-400 h-[1px] mt-3 mb-4"></div>
                  {
                    isGuest ?
                      <div className='w-full flex flex-col items-center justify-start gap-10'>
                        {
                          cart.length === 0 ? <div className='w-full text-left text-gray-500'>Your cart is empty!</div> :
                            cart.map(item => {
                              return (
                                <div key={item.id} className='w-full flex items-start justify-between gap-4'>
                                  <div className='flex items-center justify-center gap-4'>
                                    <Link to={`/product-detail/${item.productId.id}`}>
                                      <img src={item.productId.thumbnail} alt='Image' className='w-24 h-24 object-cover object-center rounded-md border border-gray-200' />
                                    </Link>
                                    <div className='flex flex-col items-start justify-between gap-2'>
                                      <div className='flex flex-col items-start justify-start gap-1'>
                                        <div className='font-medium text-gray-900 truncate max-w-[15rem]'>{item.productId.title}</div>
                                        <div className='text-sm text-gray-500'>Size: {item.size}</div>
                                      </div>
                                      <div className='flex items-center justify-center gap-1'>
                                        <div className='text-sm font-medium leading-6 text-gray-900'>Qty:</div>
                                        <select value={item.qty} onChange={(e) => handleQtyChange(e, item._id)}
                                          className='outline-none border-none py-1 cursor-pointer'>
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
                      <div className="w-full flex flex-col items-center justify-start gap-10">
                        {
                          items.length > 0 ?
                            items.map((item) => (
                              <>
                                <div key={item.id} className='w-full flex items-start justify-between gap-4'>
                                  <div className='flex items-center justify-center gap-4'>
                                    <Link to={`/product-detail/${item.product.id}`}>
                                      <img src={item.product.thumbnail} alt='Image' className='w-24 h-24 object-cover object-center rounded-md border border-gray-200' />
                                    </Link>
                                    <div className='flex flex-col items-start justify-between gap-2'>
                                      <div className='flex flex-col items-start justify-start gap-1'>
                                        <div className='font-medium text-gray-900 truncate max-w-[15rem]'>{item.product.title}</div>
                                        <div className='text-sm text-gray-500'>Size: {item.size}</div>
                                      </div>
                                      <div className='flex items-center justify-center gap-1'>
                                        <div className='text-sm font-medium leading-6 text-gray-900'>Qty:</div>
                                        <select onChange={(e) => handleQuantity(e, item)} value={item.quantity}
                                          className='outline-none border-none py-1 cursor-pointer'>
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
                                    <div className='font-medium'>
                                      {INR.format(Math.floor(item.quantity * (item.product.price - item.product.price * (item.product.discountPercentage / 100))))}
                                    </div>

                                    <div onClick={(e) => handleRemove(e, item.id)}
                                      className='text-sm text-indigo-600 hover:text-indigo-500 font-semibold cursor-pointer'>Remove</div>
                                  </div>
                                </div>

                                {/* <li key={item.id} className="flex py-6">
                                  <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-gray-200 rounded-md ">
                                    <Link to={`/product-detail/${item.product.id}`}>
                                      <img src={item.product.thumbnail} alt={item.product.title} className='w-24 h-24 object-cover object-center rounded-md border border-gray-200' />
                                    </Link>
                                  </div>

                                  <div className="flex flex-col flex-1 ml-4">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3 className="truncate max-w-[15rem]">{item.product.title}</h3>
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
                                </li> */}
                              </>
                            )) : <div className='w-full text-left text-gray-500'>Your cart is empty!</div>
                        }
                      </div>
                  }
                </div>

                <div className="px-2 mt-4">
                  {
                    isCouponApplied ?
                      <div className="w-full flex flex-col items-start justify-center gap-1">
                        <div className="w-full flex items-center justify-between">
                          <div className="text-gray-500 font-medium">{couponCode}</div>
                          <IoMdCloseCircleOutline className="text-xl text-red-600 cursor-pointer" onClick={removeCoupon} />
                        </div>
                        <div className="text-green-600 italic text-xs">*Coupon code is applied successfully.</div>
                      </div>
                      :
                      <div className="flex items-center justify-center gap-3 ">
                        <input type="text" value={couponCode} onChange={(e) => setcouponCode(e.target.value)} className="p-1.5 px-2 rounded-lg w-[90vw] text-sm" placeholder="Enter your coupon code here..." />
                        <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-3 rounded-md cursor-pointer" onClick={handleClick}>Apply</button>
                      </div>
                  }

                  <div className="flex justify-between my-2 text-base font-medium text-gray-900 mt-6">
                    <p>Subtotal</p>
                    <div className="flex items-baseline justify-center gap-1.5">
                      {amountBeforeCoupon && <p className="text-[0.8125rem] line-through">{INR.format(amountBeforeCoupon)}</p>}
                      <p>{INR.format(totalAmount)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Total Items in Cart</p>
                    <p>{totalItems} items</p>
                  </div>

                  <div className="mt-6">
                    <div
                      onClick={
                        paymentMethod === "cash" ? createOrder : initiatePayment
                      }
                      className="flex items-center justify-center px-6 py-2.5 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm cursor-pointer hover:bg-indigo-700"
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
