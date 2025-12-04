import "./App.css";
import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Provider, positions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import ProductDetailPage from "./pages/ProductDetailPage";
import Protected from "./features/auth/components/Protected";
import {
  // checkAuthAsync,
  selectLoggedInUser,
  selectUserChecked,
} from "./features/auth/authSlice";
import {
  fetchItemsByUserIdAsync,
  addToCartAsync,
} from "./features/cart/cartSlice";
import PageNotFound from "./pages/404";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import { fetchLoggedInUserAsync } from "./features/user/userSlice";
import AllProductsPage from "./pages/AllProductsPage";
import MenProductsPage from "./pages/MenProductsPage";
import WomenProductsPage from "./pages/WomenProductsPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactUsPage from "./pages/ContactUsPage";
import CrewneckWomen from "./pages/LandingPage/Allothercategory/CrewneckWomen";
import OversizedMen from "./pages/LandingPage/Allothercategory/OversizedMen";
import OversizedWomen from "./pages/LandingPage/Allothercategory/OversizedWomen";
import SportsProductPage from "./pages/Allgenre/SportsProductPage";
import DoodleProductPage from "./pages/Allgenre/DoodleProductPage";
import SuperheroProductPage from "./pages/Allgenre/SuperheroProductPage";
import MoviesProductPage from "./pages/Allgenre/MoviesProductPage";
import AnimeProductPage from "./pages/Allgenre/AnimeProductPage";
import AbstractTypoProductPage from "./pages/Allgenre/AbstractTypoProductPage";
import MusicProductPage from "./pages/Allgenre/MusicProductPage";
import BanglaProductPage from "./pages/Allgenre/BanglaProductPage";
import RefundReturnPolicy from "./pages/LandingPage/Terms&condition/Refund&ReturnPolicy";
import TermConditionmain from "./pages/LandingPage/Terms&condition/terms&condtionMain";
import { CrewneckMen } from "./pages/LandingPage/Allothercategory/CrewneckMen";
import UserOrdersDetails from "./pages/useroredrDetails";
import NavBar from "./features/navbar/Navbar";
import Loader from "./app/loader"; // Import the Loader component
import FilterSidebar from "./pages/filter/filter";
import SortSidebar from "./pages/Sort/sort";
import { Addaddress } from "./pages/Address/address";
import { Homepage } from "./features/common/outlet";
import Logout from "./features/auth/components/Logout";
import AutoExpire from "./app/AutoExpire";
import { AppProvider } from "./app/Context";
import MenHoddiesCreackneak from "./features/productmen/components/MenHoddiesCreakNeak";
import MenHoddiesDropShoulder from "./features/productmen/components/MenHoddiesdropsholder";
import WomenHoddiesDropShoulder from "./features/productmen/components/WoMenHoddiesDropShoulder";
import WomenHoddiesCreackneak from "./features/productmen/components/woMenHoddiesCreakNeak";
import { Genrepage } from "./pages/genrePage";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_LEFT,
};

// Correct routing structure with `Homepage` as the main layout wrapper
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/product-detail/:id", element: <ProductDetailPage /> },
      { path: "/refund", element: <RefundReturnPolicy /> },
      {
        path: "/order-success/:id",
        element: (
          <Protected>
            <OrderSuccessPage />
          </Protected>
        ),
      },
      {
        path: "/my-orders",
        element: (
          <Protected>
            <UserOrdersPage />
          </Protected>
        ),
      },
      {
        path: "/orders-details/:id",
        element: (
          <Protected>
            <UserOrdersDetails />
          </Protected>
        ),
      },
      {
        path: "/account",
        element: (
          <Protected>
            <UserProfilePage />
          </Protected>
        ),
      },
      { path: "/allproducts", element: <AllProductsPage /> },
      { path: "/men", element: <MenProductsPage /> },
      { path: "/women", element: <WomenProductsPage /> },
      { path: "/contactus", element: <ContactUsPage /> },
      { path: "/aboutus", element: <AboutUsPage /> },
      { path: "/termscondition", element: <TermConditionmain /> },
      { path: "/men/crewneck", element: <CrewneckMen /> },
      { path: "/women/crewneck", element: <CrewneckWomen /> },
      { path: "/men/oversized", element: <OversizedMen /> },
      { path: "/women/oversized", element: <OversizedWomen /> },
      { path: "/sports", element: <SportsProductPage /> },
      { path: "/bangla", element: <BanglaProductPage /> },
      { path: "/superhero", element: <SuperheroProductPage /> },
      { path: "/musicband", element: <MusicProductPage /> },
      { path: "/anime", element: <AnimeProductPage /> },
      { path: "/doodle", element: <DoodleProductPage /> },
      { path: "/movie", element: <MoviesProductPage /> },
      { path: "/abstract-typo", element: <AbstractTypoProductPage /> },
      { path: "/genre/:name", element: <Genrepage /> },
      { path: "/filter", element: <FilterSidebar /> },
      { path: "/sort", element: <SortSidebar /> },
      { path: "/address", element: <Addaddress /> },
      { path: "/logout", element: <Logout /> },
      { path: "/men/hoodies/crewneck", element: <MenHoddiesCreackneak /> },
      { path: "/men/hoodies/oversized", element: <MenHoddiesDropShoulder /> },
      {
        path: "/women/hoodies/oversized",
        element: <WomenHoddiesDropShoulder />,
      },
      { path: "/women/hoodies/crewneck", element: <WomenHoddiesCreackneak /> },

      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = localStorage.getItem("id");
  // const userChecked = useSelector(selectUserChecked);
  const userChecked = true;
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   dispatch(checkAuthAsync()).then(() => setLoading(false));
  // }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchItemsByUserIdAsync());
      dispatch(addToCartAsync());
      dispatch(fetchLoggedInUserAsync());
    }
  }, [dispatch, user]);

  return (
    <AppProvider>
      <div className="App">
        {loading || !userChecked ? (
          <Loader />
        ) : (
          <Provider template={AlertTemplate} {...options}>
            <AutoExpire />
            <RouterProvider router={router} />
          </Provider>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
