import { configureStore, createReducer } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';
import userReducer from '../features/user/userSlice';
import GenereSlice from '../pages/Allgenre/GenereSlice';
export const store = configureStore({
  reducer: {
    product: productReducer,
    loginDetails: authReducer,
    cart: cartReducer,
    order: orderReducer,
    user: userReducer,
    genere:GenereSlice,
  },
});
