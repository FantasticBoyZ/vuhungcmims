import importOrderService from '@/services/importOrderService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getImportOrderList = createAsyncThunk('importOrderList', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const importOrder = await importOrderService.getImportOrderList(params);
  return importOrder;
})


const importOrderSlice = createSlice({
  name: 'importOrders',
  initialState: {
    importOrderList: [],
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
    [getImportOrderList.pending]: (state) => {
      state.loading = true;
    },
    [getImportOrderList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getImportOrderList.fulfilled]: (state, action) => {
      state.loading = false;
      state.importOrderList = action.payload;
    }
  }
});

const { reducer: importOrderReducer } = importOrderSlice;
export default importOrderReducer;
