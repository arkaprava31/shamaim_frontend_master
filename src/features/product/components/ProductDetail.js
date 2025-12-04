import { useState, useEffect, useContext } from "react";
import { RadioGroup } from "@headlessui/react";
import { baseUrl, getGuestUserId, getId } from "../../../app/constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductByIdAsync,
  selectProductById,
  selectProductListStatus,
} from "../productSlice";
import { useParams } from "react-router-dom";
import { addToCartAsync, selectItems } from "../../cart/cartSlice";
import { selectLoggedInUser } from "../../auth/authSlice";
import { useAlert } from "react-alert";
import { Grid } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../../app/Context";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { FacebookIcon, FacebookShareButton, TelegramIcon, TelegramShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import SimilarProducts from "./SimilarProducts";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const colors = [
  { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
  { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
  { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
];

const sizes = [
  { name: "XXS", inStock: false },
  { name: "XS", inStock: true },
  { name: "S", inStock: true },
  { name: "M", inStock: true },
  { name: "L", inStock: true },
  { name: "XL", inStock: true },
  { name: "2XL", inStock: true },
  { name: "3XL", inStock: true },
];

const sizeChart = [
  { name: "S", chest: 38.0, front: 27.25, sleeve: 8.0 },
  { name: "M", chest: 40.0, front: 28.0, sleeve: 8.25 },
  { name: "L", chest: 42.0, front: 28.75, sleeve: 8.5 },
  { name: "XL", chest: 44.0, front: 29.5, sleeve: 8.75 },
  { name: "2XL", chest: 46.0, front: 30.0, sleeve: 9.0 },
  { name: "3XL", chest: 48.0, front: 30.5, sleeve: 9.25 },
];

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const items = useSelector(selectItems);
  const product = useSelector(selectProductById);
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
  const status = useSelector(selectProductListStatus);
  const Navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const { updateCart, updateLoggedInCart, handleLoggedInOrGuest } = useContext(AppContext);

  const handleCart = async () => {
    const productprice = product.price;
    const discountpercentage = product.discountPercentage;
    const actualvalue = productprice * (discountpercentage / 100);

    const matcheditemSized = items.find((item) => {
      return item.product.id == product.id && item.size.name == selectedSize.name;
    })
    if (getId()) {
      if (matcheditemSized == undefined || Object.keys(matcheditemSized).length < 0) {
        if (selectedSize) {
          const newItem = {
            product: product.id,
            quantity: 1,
          };
          if (selectedColor) {
            newItem.color = selectedColor;
          }
          if (selectedSize) {
            newItem.size = selectedSize;
            setSelectedSize("");
          }
          dispatch(addToCartAsync({ item: newItem, alert }));
          alert.success("item added in cart");

          updateLoggedInCart(items);
          handleLoggedInOrGuest();

        } else {
          alert.error("please select size ");
        }
      } else {
        alert.error("Item Already added");
      }
    } else {
      try {

        const newItem = {
          productId: product.id.toString(),
          price: Math.floor(product.price - product.price * (product.discountPercentage / 100)),
          qty: 1,
          size: selectedSize
        };

        if (selectedSize) {
          if (getGuestUserId()) {
            const res = await axios.put(`${baseUrl}/api/addToCart/${getGuestUserId()}`, newItem);
            alert.success(res.data.message);
          } else {
            const res = await axios.post(`${baseUrl}/api/addToCart`, newItem);

            const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000); //session of 2 hrs
            localStorage.setItem('guestUserId', res.data.guestUserId);
            localStorage.setItem('guestUserExpiry', expiryTime);

            alert.success(res.data.message);
          }

          updateCart();
          handleLoggedInOrGuest();
        } else {
          alert.error("Please select size to continue.");
        }

      } catch (error) {
        alert.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const [openShare, setOpenShare] = useState(false);

  const handleOpenShare = () => {
    setOpenShare(!openShare);
  };

  return (
    <div className="bg-white ">
      {status === "loading" ? (
        <Grid
          height="200"
          width="150"
          color="rgb(79, 70, 229) "
          ariaLabel="grid-loading"
          radius="12.5"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      ) : null}
      {product && (
        <>
          <div className="pt-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center max-w-2xl px-4 mx-auto space-x-2 sm:px-6 lg:max-w-7xl lg:px-8">
                {product.breadcrumbs &&
                  product.breadcrumbs.map((breadcrumb) => (
                    <li key={breadcrumb.id}>
                      <div className="flex items-center">
                        <a
                          href={breadcrumb.href}
                          className="mr-2 text-sm font-medium text-gray-900"
                        >
                          {breadcrumb.name}
                        </a>
                        <svg
                          width={16}
                          height={20}
                          viewBox="0 0 16 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className="w-4 h-5 text-gray-300"
                        >
                          <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                        </svg>
                      </div>
                    </li>
                  ))}
                <li className="text-sm">
                  <a
                    href={product.href}
                    aria-current="page"
                    className="font-medium text-gray-500 hover:text-gray-600"
                  >
                    {/* {product.title} */}
                  </a>
                </li>
              </ol>
            </nav>

            {/* Image gallery */}
            <div>
              <div className="hidden max-w-2xl mx-auto mt-6 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
                {/* Main Image */}
                <div className="rounded-lg aspect-h-4 aspect-w-3 lg:block">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="object-cover object-center w-[80%] h-full transform hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                </div>

                {/* Two Vertical Images */}
                <div className="lg:grid lg:grid-cols-1 lg:gap-y-8">
                  <div className="overflow-hidden rounded-lg aspect-h-2 aspect-w-3 transform hover:scale-110 transition-transform duration-300 ease-in-out">
                    <img
                      src={product.images[1]}
                      alt={product.title}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg aspect-h-2 aspect-w-3 transform hover:scale-110 transition-transform duration-300 ease-in-out">
                    <img
                      src={product.images[2]}
                      alt={product.title}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>
                </div>

                {/* Third Image */}
                <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
                  <img
                    src={product.images[3]}
                    alt={product.title}
                    className="object-cover object-center w-full h-full transform hover:scale-110 transition-transform duration-300 ease-in-out"
                  />
                </div>
              </div>

              <div className="sm:hidden">
                <Slider {...settings}>
                  {/* First Image */}
                  <div className="image-container">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="zoomable-image"
                    />
                  </div>

                  {/* Second Image */}
                  <div className="image-container">
                    <img
                      src={product.images[1]}
                      alt={product.title}
                      className="zoomable-image"
                    />
                  </div>

                  {/* Third Image */}
                  <div className="image-container">
                    <img
                      src={product.images[2]}
                      alt={product.title}
                      className="zoomable-image"
                    />
                  </div>

                  {/* Fourth Image */}
                  <div className="image-container">
                    <img
                      src={product.images[3]}
                      alt={product.title}
                      className="zoomable-image"
                    />
                  </div>
                </Slider>

                <style jsx>{`
                .image-container {
                  overflow: hidden;
                  position: relative;
                }

                .zoomable-image {
                  width: 100%;
                  height: auto;
                  transition: transform 0.5s ease-in-out;
                }

                .image-container:hover .zoomable-image,
                .image-container:focus .zoomable-image {
                  transform: scale(1.5); /* Zoom on hover/tap */
                }

                @media (max-width: 640px) {
                  .zoomable-image {
                    cursor: zoom-in;
                  }

                  /* On mobile, zoom in on tap */
                  .image-container:active .zoomable-image {
                    transform: scale(1.5);
                  }
                }
              `}</style>
              </div>
            </div>
            {/* Product info */}
            <div className="mx-auto max-w-2xl px-4 pb-0 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-0 lg:pt-16">
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <p className=" text-3xl pb-2">Shamaim</p>
                <h1 className="sm:ext-2xl text-gray-900 font-semiboldtracking-tight text-lg">
                  {product.title}
                </h1>
              </div>

              {/* Options */}
              <div className="mt-4  lg:row-span-3 lg:mt-0">
                <div className=" flex  justify-between items-center">
                  <p className="text-3xl tracking-tight text-gray-900 opacity-100">
                    <span className=" text-2xl">₹</span>
                    {Math.floor(
                      product.price -
                      product.price * (product.discountPercentage / 100)
                    )}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xl   tracking-tight text-gray-900 line-through opacity-50">
                      ₹{product.price}
                    </p>
                    <p className=" text-2xl  text-[#00b852]">
                      {product.discountPercentage}% OFF
                    </p>
                  </div>
                </div>
                <p className=" text-sm opacity-50">inclusive of all taxes</p>

                <form className="mt-10">
                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Color</h3>

                      <RadioGroup
                        value={selectedColor}
                        onChange={setSelectedColor}
                        className="mt-4"
                      >
                        <RadioGroup.Label className="sr-only">
                          Choose a color
                        </RadioGroup.Label>
                        <div className="flex items-center space-x-3">
                          {product.colors.map((color) => (
                            <RadioGroup.Option
                              key={color.name}
                              value={color}
                              className={({ active, checked }) =>
                                classNames(
                                  color.selectedClass,
                                  active && checked ? "ring ring-offset-1" : "",
                                  !active && checked ? "ring-2" : "",
                                  "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                                )
                              }
                            >
                              <RadioGroup.Label as="span" className="sr-only">
                                {color.name}
                              </RadioGroup.Label>
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  color.class,
                                  "h-8 w-8 rounded-full border border-black border-opacity-10"
                                )}
                              />
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.size && product.size.length > 0 && (
                    <div className="mt-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          Size
                        </h3>
                        <div onClick={handleOpen} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Size guide</div>
                      </div>

                      <RadioGroup
                        value={selectedSize}
                        onChange={setSelectedSize}
                        className="mt-4"
                      >
                        <RadioGroup.Label className="sr-only">
                          Choose a size
                        </RadioGroup.Label>
                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                          {product.size.map((size) => (
                            <RadioGroup.Option
                              key={size}
                              value={size}
                              disabled={!size}
                              className={({ active }) =>
                                classNames(
                                  size
                                    ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                    : "cursor-not-allowed bg-gray-50 text-gray-200",
                                  active ? "ring-2 ring-indigo-500" : "",
                                  "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <RadioGroup.Label as="span">
                                    {size}
                                  </RadioGroup.Label>
                                  {size ? (
                                    <span
                                      className={classNames(
                                        active ? "border" : "border-2",
                                        checked
                                          ? "border-indigo-500"
                                          : "border-transparent",
                                        "pointer-events-none absolute -inset-px rounded-md"
                                      )}
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <span
                                      aria-hidden="true"
                                      className="absolute border-2 border-gray-200 rounded-md pointer-events-none -inset-px"
                                    >
                                      <svg
                                        className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        stroke="currentColor"
                                      >
                                        <line
                                          x1={0}
                                          y1={100}
                                          x2={100}
                                          y2={0}
                                          vectorEffect="non-scaling-stroke"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  {/* Sizes */}
                  {/* <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <div onClick={handleOpen} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Size guide</div>
                  </div>
                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a size
                    </RadioGroup.Label>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                      {sizes.map((size) => (
                        <RadioGroup.Option
                          key={size.name}
                          value={size}
                          disabled={product?.stock[0][size?.name] == 0}
                          className={({ active }) =>
                            classNames(
                              product?.stock[0][size?.name] !== 0
                                ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                : "cursor-not-allowed bg-gray-50 text-gray-200",
                              active ? "ring-2 ring-indigo-500" : "",
                              "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">
                                {size.name}
                              </RadioGroup.Label>
                              {size.inStock ? (
                                <span
                                  className={classNames(
                                    active ? "border" : "border-2",
                                    checked
                                      ? "border-indigo-500"
                                      : "border-transparent",
                                    "pointer-events-none absolute -inset-px rounded-md"
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="absolute border-2 border-gray-200 rounded-md pointer-events-none -inset-px"
                                >
                                  <svg
                                    className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line
                                      x1={0}
                                      y1={100}
                                      x2={100}
                                      y2={0}
                                      vectorEffect="non-scaling-stroke"
                                    />
                                  </svg>
                                </span>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div> */}

                  <Dialog open={open} handler={handleOpen} size="lg" className="w-full flex flex-col items-center justify-start gap-1 p-4 text-black tracking-wider">
                    <div className="w-full text-left text-lg font-semibold">Size Guide</div>
                    <div className="w-full flex items-center justify-end">
                      <div className="text-white bg-black px-3 py-0.5 rounded-md">inch</div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row items-center justify-center mt-2">
                      <div className="w-full md:w-[40%] flex items-center justify-center">
                        <img className="w-full" src="./../../guide.jpg" />
                      </div>
                      <div className="w-full md:w-[60%] flex items-center justify-start">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-200">
                              <th>Size</th>
                              <th>Chest</th>
                              <th>Front Length</th>
                              <th>Sleeve Length</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              sizeChart.map(d => {
                                return (
                                  <tr className="text-sm">
                                    <td>{d.name}</td>
                                    <td>{d.chest}</td>
                                    <td>{d.front}</td>
                                    <td>{d.sleeve}</td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Dialog>

                  <button
                    onClick={handleCart}
                    type="button"
                    className="sticky bottom-10 flex items-center justify-center w-full px-8 py-3 mt-10 text-base font-medium text-white bg-orange-400 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add to Cart
                  </button>
                </form>

                <button onClick={handleOpenShare} className="mt-4 flex items-center justify-center w-full px-8 py-3 text-black font-medium bg-gray-100 hover:bg-gray-200 rounded-md">
                  Share product
                </button>
              </div>

              <Dialog open={openShare} handler={handleOpenShare} size="md" className="p-4 bg-white w-full flex flex-col items-center justify-center gap-4">
                <div className="w-full flex items-center justify-center gap-2">
                  <FacebookShareButton url={window.location.href}>
                    <FacebookIcon size={44} round={true} />
                  </FacebookShareButton>
                  <WhatsappShareButton url={window.location.href}>
                    <WhatsappIcon size={44} round={true} />
                  </WhatsappShareButton>
                  <TelegramShareButton url={window.location.href}>
                    <TelegramIcon size={44} round={true} />
                  </TelegramShareButton>
                </div>
                <div className="border border-solid border-gray-600 py-1.5 px-2 bg-gray-100 text-black rounded-md">{window.location.href}</div>
              </Dialog>

              <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                {/* Description and details */}
                <div>
                  <h3 className="sr-only">Description</h3>

                  <div className="space-y-6">
                    <p className="text-base text-gray-900">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-sm font-medium text-gray-900">
                    Highlights
                  </h3>

                  <div className="mt-4">
                    <ul role="list" className="pl-4 space-y-2 text-sm list-disc">
                      <li>
                        {" "}
                        <span className="font-semibold ">
                          Standard Sizing:
                        </span>{" "}
                        We follow U.S. and EU standards and our sizes do not vary
                        by more than +/- 0.5 inches.
                      </li>
                      <li>
                        {" "}
                        <span className="font-semibold ">
                          {" "}
                          Estimated Delivery Time:
                        </span>{" "}
                        <span className="font-semibold "></span> 4 - 8 working
                        days And
                        <span className="font-semibold "> Metros City:</span> 1 -
                        5 working days{" "}
                      </li>
                      <li>
                        Colours may slightly vary depending on your screen
                        brightness. Product specifications mentioned above may
                        vary by +/- 10%.
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Description  */}
                <div className="">
                  <h1 className="mt-6 font-bold">Product Description</h1>
                  <ul className="mt-4 ml-4 list-disc">
                    <li>
                      <span className="font-semibold">Style:</span>{" "}
                      {product.Style}
                    </li>
                    <li>
                      <span className="font-semibold">Sleeve Length:</span>{" "}
                      {product.SleeveLength}
                    </li>
                    <li>
                      <span className="font-semibold">Fit:</span> {product.Fit}
                    </li>
                    <li>
                      <span className="font-semibold">Neck Type:</span>{" "}
                      {product.NeckType}
                    </li>
                    <li>
                      <span className="font-semibold">Pattern:</span>{" "}
                      {product.Style}
                    </li>
                    <li>
                      <span className="font-semibold">About The Design:</span>{" "}
                      {product.AboutTheDesign}
                    </li>
                    <li>
                      <span className="font-semibold">Material:</span>{" "}
                      {product.Material}
                    </li>
                    <li>
                      <span className="font-semibold">GSM:</span> {product.GSM}
                    </li>
                    <li>
                      <span className="font-semibold">Country Of Origin:</span>{" "}
                      {product.CountryOfOrigin}
                    </li>
                    <li>
                      <span className="font-semibold">Product Code:</span>{" "}
                      {product.ProductCode}
                    </li>
                    <li>
                      <span className="font-semibold">Care Instructions:</span>{" "}
                      {product.CareInstructions}
                    </li>
                  </ul>
                </div>

                {/* <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </div> */}
              </div>
            </div>
          </div>

          <SimilarProducts cat={product.category} subCat={product.subcategory} />
        </>
      )}
    </div>
  );
}