import categoryService from '@/services/categoryService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getCategoryList = createAsyncThunk('category' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const categoryList = await categoryService.getCategoryList(params);
  return categoryList;
})

export const getSubCategoryByCategoryId = createAsyncThunk('subCategory' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const subCategoryList = await categoryService.getSubCategoryByCategoryId(params);
  return subCategoryList;
})

export const getCategoryDetail = createAsyncThunk('category/get-one' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const category = await categoryService.getCategoryDetail(params);
  return category;
})

export const saveCategory = createAsyncThunk('category/save' , async (category, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const response = await categoryService.saveCategory(category);
  return response;
})

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    loading: false,
    error: null,
    edit: false
  },
  reducers: {

  },
  extraReducers: {
    [getCategoryList.pending] : (state) => {
      state.loading = true;
    },
    [getCategoryList.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getCategoryList.fulfilled] :(state, action) => {
      state.loading = false;
    },
    [getCategoryDetail.pending] : (state) => {
      state.loading = true;
    },
    [getCategoryDetail.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getCategoryDetail.fulfilled] :(state, action) => {
      state.loading = false;
    },
  }
});

const { reducer: categoryReducer} = categorySlice;
export default categoryReducer;
