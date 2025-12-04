import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchProductSports,
    fetchProductAbstractTypo,
    fetchProductAnime,
    fetchProductMovie,
    fetchProductMusic,
    fetchProductsBangla,
    fetchProdctDoodle,
  fetchProductSuperHero

 } from './genereApi';

const initialState = {
    products: [],
  
    brands: [],
    categories: [],
    status: 'idle',
    totalItems: 0,
    selectedProduct: null,
  };
  

  export const fetchProductsSportsAsync = createAsyncThunk(
    'product/fetchProductSports',
    async ({ filter, sort, pagination, admin }) => {
      const response = await fetchProductSports(filter, sort, pagination, admin);
      return response.data;
    }
  );

  export const fetchProductSuperHeroAsync = createAsyncThunk(
    'product/fetchProductSuperHero',
    async ({ filter, sort, pagination, admin }) => {
      const response = await fetchProductSuperHero(filter, sort, pagination, admin);
      return response.data;
    }
  );

  export const fetchProductAbstractTypoAsync = createAsyncThunk(
    'product/fetchProductAbstractTypo',
    async ({ filter, sort, pagination, admin }) => {
      const response = await fetchProductAbstractTypo(filter, sort, pagination, admin);
      return response.data;
    }
  );
  export const fetchProductAnimeAsync = createAsyncThunk(
    'product/fetchProductAnime',
    async ({ filter, sort, pagination, admin }) => {
      const response = await fetchProductAnime(filter, sort, pagination, admin);
      return response.data;
    }
  );
  export const fetchProductMovieAsync = createAsyncThunk(
    'product/fetchProductMovie',
    async ({ filter, sort, pagination, admin }) => {
      const response = await fetchProductMovie(filter, sort, pagination, admin);
      return response.data;
    }
  );
  export const fetchProductMusicAsync = createAsyncThunk(
    'product/fetchProductMusic',
    async ({ filter, sort, pagination, admin }) => {
      const response = await fetchProductMusic(filter, sort, pagination, admin);
      return response.data;
    }
  );
  export const fetchProductsBanglaAsync = createAsyncThunk(
    'product/fetchProductsBangla',
    async ({ filter, sort, pagination, admin }) => {
      const response = await fetchProductsBangla(filter, sort, pagination, admin);
      return response.data;
    }
  );
  export const fetchProdctDoodleAsync = createAsyncThunk(
    'product/fetchProdctDoodle',
    async ({ filter, sort, pagination, admin }) => {
      const response = await fetchProdctDoodle(filter, sort, pagination, admin);
      return response.data;
    }
  );

  
export const GenereSlice = createSlice({
    name: 'product',
    initialState,
    
    reducers: {
      clearSelectedProduct:(state)=>{
        state.selectedProduct = null
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchProductsSportsAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchProductsSportsAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.products = action.payload.products;
          state.totalItems = action.payload.totalItems;
        })

        .addCase(fetchProductSuperHeroAsync.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchProductSuperHeroAsync.fulfilled, (state, action) => {
          state.status = 'idle';
          state.products = action.payload.products;
          state.totalItems = action.payload.totalItems;
        })

        .addCase(fetchProductAbstractTypoAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchProductAbstractTypoAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload.products;
            state.totalItems = action.payload.totalItems;
          })

          .addCase(fetchProductAnimeAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchProductAnimeAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload.products;
            state.totalItems = action.payload.totalItems;
          })

          .addCase(fetchProductMovieAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchProductMovieAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload.products;
            state.totalItems = action.payload.totalItems;
          })

          .addCase(fetchProductMusicAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchProductMusicAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload.products;
            state.totalItems = action.payload.totalItems;
          })

          .addCase(fetchProductsBanglaAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchProductsBanglaAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload.products;
            state.totalItems = action.payload.totalItems;
          })

          .addCase(fetchProdctDoodleAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchProdctDoodleAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload.products;
            state.totalItems = action.payload.totalItems;
          })


    },
});

export const { clearSelectedProduct } = GenereSlice.actions;
export const selectAllProducts = (state) => state.product.products;
export const selectTotalItems = (state) => state.product.totalItems;

export default GenereSlice.reducer;
