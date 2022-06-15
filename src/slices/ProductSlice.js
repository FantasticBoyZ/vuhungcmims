import productService from '@/services/productService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getProductList = createAsyncThunk('product' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const productList = await productService.getAllProduct(params);
  return productList;
})

export const getProductDetail = createAsyncThunk('product/get-one', async (id) => {
  const product = await productService.getProductById(id)
  return product
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
    edit: false
  },
  reducers: {
    addProduct: (state, action) => {
      // const newPost  = action.payload;
      state.push(action.payload);
    },
  },
  extraReducers: {
    [getProductList.pending] : (state) => {
      state.loading = true;
    },
    [getProductList.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getProductList.fulfilled] :(state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    [getProductDetail.pending] : (state) => {
      state.loading = true;
    },
    [getProductDetail.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getProductDetail.fulfilled] :(state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
  }
});

const { reducer: productReducer} = productSlice;
export default productReducer;
