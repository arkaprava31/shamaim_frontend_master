import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchProductsByFilters,
  fetchCategories,
  fetchProductsOversized,
  fetchProductsWomen,
  fetchProductByCrewneak,
  fetchProductsWomenOversized,
  fetchProductsWomencrewneak,
  fetchCategoryProduct
} from './productAPI';

const initialState = {
  products: [],
  brands: [],
  categories: [],
  status: 'idle',
  totalItems: 0,
  selectedProduct: null,
};




export const fetchProductCrewNeakAsync = createAsyncThunk(
  'product/fetchProductByCrewneak',
  async ({ page}) => {
    const response = await  fetchProductByCrewneak( page);
    return response.data;
  }
);

export const fetchCategoryProductAsync = createAsyncThunk(
  'product/fetchCategoryProduct',
  async ({ page,subcategories,gender}) => {
    const response = await  fetchCategoryProduct( page,subcategories,gender);
    return response.data;
  }
);



export const fetchProductsByFiltersAsync = createAsyncThunk(
  'product/fetchProductsByFilters',
  async ({page}) => {
    const response = await fetchProductsByFilters(page);
    return response.data;
  }
);

export const fetchProductsWomenAsync = createAsyncThunk(
  'product/fetchProductsWomen',
  async ({ page}) => {
    const response = await fetchProductsWomen(page);
    return response.data;
  }
);


export const fetchProductsOversizedAsync = createAsyncThunk(
  'product/fetchProductsOversized',
  async ({ page}) => {
    const response = await fetchProductsOversized(page);
    return response.data;
  }
);
export const fetchProductsWomenOversizedAsync = createAsyncThunk(
  'product/fetchProductsWomenOversized',
  async ({ page }) => {
    const response = await fetchProductsWomenOversized(page);
    return response.data;
  }
);

export const fetchProductsWomenCrewneakAsync = createAsyncThunk(
  'product/fetchProductsWomencrewneak',
  async ({ page }) => {
    const response = await fetchProductsWomencrewneak(page);
    return response.data;
  }
);


export const fetchCategoriesAsync = createAsyncThunk(
  'product/fetchCategories',
  async () => {
    const response = await fetchCategories();
    return response.data;
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  
  reducers: {
    clearSelectedProduct:(state)=>{
      state.selectedProduct = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })

      .addCase(  fetchProductCrewNeakAsync
        .pending, (state) => {
        state.status = 'loading';
      })
      .addCase(  fetchProductCrewNeakAsync
        .fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProductsWomenAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsWomenAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })

      .addCase(fetchCategoryProductAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryProductAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProductsOversizedAsync.pending, (state) => {
        state.status = 'loading';
      })
      
      .addCase(fetchProductsOversizedAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProductsWomenOversizedAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsWomenOversizedAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchProductsWomenCrewneakAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsWomenCrewneakAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.categories = action.payload;
      })
   
    
     
  },
});

export const { clearSelectedProduct } = productSlice.actions;

export const selectAllProducts = (state) => state.product.products;
export const selectBrands = (state) => state.product.brands;
export const selectCategories = (state) => state.product.categories;
export const selectProductById = (state) => state.product.selectedProduct;
export const selectProductListStatus = (state) => state.product.status;
export const selectTotalItems = (state) => state.product.totalItems;

export default productSlice.reducer;
