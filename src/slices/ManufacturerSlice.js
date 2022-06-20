import manufactorService from '@/services/manufactorService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getManufacturerList = createAsyncThunk('manufacturer/get-list' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const manufacturerList = await manufactorService.getManufactorList(params);
  return manufacturerList;
})

const categorySlice = createSlice({
  name: 'manufacturers',
  initialState: {
    loading: false,
    error: null,
    edit: false
  },
  reducers: {

  },
  extraReducers: {
    [getManufacturerList.pending] : (state) => {
      state.loading = true;
    },
    [getManufacturerList.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getManufacturerList.fulfilled] :(state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    
  }
});

const { reducer: categoryReducer} = categorySlice;
export default categoryReducer;
