import productService from '@/services/productService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getProductList = createAsyncThunk('product', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const productList = await productService.getAllProduct(params);
  return productList;
});

export const getProductDetail = createAsyncThunk('product/get-one', async (params) => {
  const product = await productService.getProductById(params);
  return product;
});

export const saveProduct = createAsyncThunk(
  'product/save',
  async (product, { rejectWithValue }) => {
    try {
      const response = await productService.saveProduct(product);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
    
      return rejectWithValue(err.response.data);
    }
  },
);

export const uploadNewImageProduct = createAsyncThunk(
  'product/upload-new-image',
  async (formData) => {
    return await productService.uploadNewImage(formData);
  },
);

export const updateImageProduct = createAsyncThunk(
  'product/update-image',
  async (params) => {
    const { productId, formData } = params;
    return await productService.updateImage(productId, formData);
  },
);

export const getProductByImportOrderId = createAsyncThunk(
  'product/get-by-import-order',
  async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const productList = await productService.getProductByImportOrderId(params);
    return productList;
  },
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
    uploadImage: false,
  },
  reducers: {
    addProduct: (state, action) => {
      // const newPost  = action.payload;
      state.push(action.payload);
    },
  },
  extraReducers: {
    [getProductList.pending]: (state) => {
      state.loading = true;
    },
    [getProductList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getProductList.fulfilled]: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    [getProductDetail.pending]: (state) => {
      state.loading = true;
    },
    [getProductDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getProductDetail.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [saveProduct.pending]: (state) => {
      state.loading = true;
    },
    [saveProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [saveProduct.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [uploadNewImageProduct.pending]: (state) => {
      state.loading = true;
      state.uploadImage = false;
    },
    [uploadNewImageProduct.rejected]: (state, action) => {
      state.loading = false;
      state.uploadImage = true;
      state.error = action.payload;
    },
    [uploadNewImageProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.uploadImage = true;
    },
    [updateImageProduct.pending]: (state) => {
      state.loading = true;
      state.uploadImage = false;
    },
    [updateImageProduct.rejected]: (state, action) => {
      state.loading = false;
      state.uploadImage = true;
      state.error = action.payload;
    },
    [updateImageProduct.fulfilled]: (state, action) => {
      state.loading = false;
      state.uploadImage = true;
    },
  },
});

const { reducer: productReducer } = productSlice;
export default productReducer;
