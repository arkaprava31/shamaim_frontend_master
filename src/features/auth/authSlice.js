import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl, getId } from "../../app/constants";
import axios from "axios";

// Async thunk to fetch email login
export const getEmail = createAsyncThunk(
  "loginDetails/getEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, { email });
      if (response) {
        localStorage.setItem("email", email);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk to verify OTP
export const VarifyOtp = createAsyncThunk(
  "loginDetails/VarifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/verify`, {
        email,
        otp,
      });
      if (response) {
        localStorage.setItem("id", response.data.id);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk for signing out
export const signOutAsync = createAsyncThunk(
  "loginDetails/signOut",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.clear();
      return "Signed out successfully";
    } catch (error) {
      return rejectWithValue(error || "Something went wrong");
    }
  }
);

// Async thunk to fetch auth status based on the ID
export const fetchAuthStatus = createAsyncThunk(
  "loginDetails/fetchAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const id = getId();
      const response = await fetch(`${baseUrl}/auth/check/${id}`);

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorText = await response.text();
        return rejectWithValue(errorText);
      }
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const insertGoogleEmail = createAsyncThunk(
  "loginDetails/insertGoogleEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const responce = await axios.get(`${baseUrl}/auth/getEmail/?email=${email}`);
      if(responce){
        localStorage.setItem("id",responce?.data);
      }
      return responce;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

// Create login slice
const loginSlice = createSlice({
  name: "loginDetails",
  initialState: {
    data: [],
    status: null,
    error: null,
    userChecked: false,
    loggedInUserToken: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling getEmail thunk
      .addCase(getEmail.pending, (state) => {
        state.status = "loading";
        state.userChecked = true;
      })
      .addCase(getEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.userChecked = true;
      })
      .addCase(getEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.userChecked = true;
      })
      // Handling VarifyOtp thunk
      .addCase(VarifyOtp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(VarifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loggedInUserToken = action.payload;
        state.data = action.payload;
      })
      .addCase(VarifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handling signOutAsync thunk
      .addCase(signOutAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutAsync.fulfilled, (state) => {
        state.status = "succeeded";
        state.loggedInUserToken = null;
        state.data = [];
        state.userChecked = false;
      })
      // Handling fetchAuthStatus thunk
      .addCase(fetchAuthStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAuthStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loggedInUserToken = action.payload.id || null;
        state.data = action.payload;
      })
      .addCase(fetchAuthStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectLoggedInUser = (state) => state.loginDetails.loggedInUserToken;
export const selectUserChecked = (state) => state.loginDetails.userChecked;
export const getEmailResponce = (state) => state.loginDetails.data;
export const getOtpResponce = (state) => state.loginDetails.data;

// Export the reducer to be used in the store
export default loginSlice.reducer;
