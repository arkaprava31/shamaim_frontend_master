import "./App.css";
import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Provider, positions } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import ProductDetailPage from "./pages/ProductDetailPage";
import Protected from "./features/auth/components/Protected";
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
import RefundReturnPolicy from "./pages/LandingPage/Terms&condition/Refund&ReturnPolicy";
import TermConditionmain from "./pages/LandingPage/Terms&condition/terms&condtionMain";
import { CrewneckMen } from "./pages/LandingPage/Allothercategory/CrewneckMen";
import UserOrdersDetails from "./pages/useroredrDetails";
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
import ComingSoon from "./pages/ComingSoon";
import MensPolo from "./features/productmen/components/MensPolo";

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
          // <Protected>
          //   <OrderSuccessPage />
          // </Protected>

          <OrderSuccessPage />
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

      { path: "/men/crewneck/:pattern", element: <CrewneckMen /> },
      { path: "/women/crewneck/:pattern", element: <CrewneckWomen /> },
      { path: "/men/oversized/:pattern", element: <OversizedMen /> },
      { path: "/women/oversized/:pattern", element: <OversizedWomen /> },
      { path: "/men/polo/:pattern", element: <MensPolo /> },
      { path: "/women/polo/:pattern", element: <ComingSoon /> },
      { path: "/men/hoodies/crewneck/:pattern", element: <MenHoddiesCreackneak /> },
      { path: "/men/hoodies/oversized/:pattern", element: <MenHoddiesDropShoulder /> },
      { path: "/women/hoodies/oversized/:pattern", element: <WomenHoddiesDropShoulder />, },
      { path: "/women/hoodies/crewneck/:pattern", element: <WomenHoddiesCreackneak /> },

      { path: "/banner/:bannerId", element: <ComingSoon /> },
      { path: "/genre/:name", element: <Genrepage /> },

      { path: "/filter", element: <FilterSidebar /> },
      { path: "/sort", element: <SortSidebar /> },
      { path: "/address", element: <Protected><Addaddress /></Protected> },
      { path: "/logout", element: <Logout /> },

      { path: "*", element: <PageNotFound /> },
      { path: "/coming-soon", element: <ComingSoon /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          await Promise.all([
            dispatch(fetchItemsByUserIdAsync()),
            dispatch(addToCartAsync()),
            dispatch(fetchLoggedInUserAsync()),
          ]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, user]);

  return (
    <AppProvider>
      <div className="App">
        {loading ? (
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
