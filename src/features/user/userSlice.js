import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelOrder,
  returnOrder,
  fetchLoggedInUserOrders,
  updateUser,
  fetchLoggedInUser,
  fetchproductstatusbyid,
  fetchorderbyid
} from "./userAPI";

const initialState = {
  status: "idle",
  userInfo: null,
  productStatus:null,
};

export const fetchLoggedInUserOrderAsync = createAsyncThunk(
  "user/fetchLoggedInUserOrders",
  async () => {
    const response = await fetchLoggedInUserOrders();
    return response.data;
  }
);

export const fetchorderbyidAsync = createAsyncThunk(
  "user/fetchorderbyid",
  async (id) => {
    const response = await fetchorderbyid(id);
    return response.data;
  }
);

export const fetchLoggedInUserAsync = createAsyncThunk(
  "user/fetchLoggedInUser",
  async () => {
    const response = await fetchLoggedInUser();
    return response.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/updateUser",
  async (update) => {
    const response = await updateUser(update);
    return response.data;
  }
);

export const cancelUserOrderAsync = createAsyncThunk(
  "user/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await cancelOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const returnUserOrderAsync = createAsyncThunk(
  "user/returnOrder",
  async ({order,orderId}, { rejectWithValue }) => {
    try {
      const response = await returnOrder(order,orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchproductorderbyidAsync = createAsyncThunk(
  "user/fetchproductstatusbyid",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await fetchproductstatusbyid(productId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUserOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoggedInUserOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";

        state.orders = action.payload;
      })
      .addCase(fetchorderbyidAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchorderbyidAsync.fulfilled, (state, action) => {
        state.status = "idle";

        state.orders = action.payload;
      })
      .addCase(returnUserOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(returnUserOrderAsync.fulfilled, (state,action) => {
        state.status = "idle";
        state.productStatus = action.payload;
      })

      .addCase(fetchproductorderbyidAsync.pending,(state)=>{
        state.status='loading';
      })

      .addCase(fetchproductorderbyidAsync.fulfilled,(state,action)=>{
        state.status = "idle";
        state.productStatus = action.payload;

      })

      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // earlier there was loggedInUser variable in other slice
        state.userInfo = action.payload;
      })
      .addCase(fetchLoggedInUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLoggedInUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // this info can be different or more from logged-in User info
        state.userInfo = action.payload;
      });
  },
});
export const selectUserOrders = (state) =>
state.user.userInfo ? state.user.userInfo.orders : null;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectUserInfoStatus = (state) => state.user.status;
export const selectProductStatus = (state) => state.user.productStatus;

// export const { increment } = userSlice.actions;

export default userSlice.reducer;
