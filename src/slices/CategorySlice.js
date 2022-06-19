import categoryService from '@/services/categoryService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getCategoryList = createAsyncThunk('category' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const categoryList = await categoryService.getCategoryList(params);
  return categoryList;
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
      state.products = action.payload;
    },
    
  }
});

const { reducer: categoryReducer} = categorySlice;
export default categoryReducer;
