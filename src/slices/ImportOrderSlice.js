import importOrderService from '@/services/importOrderService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getImportOrderList = createAsyncThunk('importOrder/list', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const importOrder = await importOrderService.getImportOrderList(params);
  return importOrder;
})

export const getImportOrderById = createAsyncThunk('importOrder/detail', async (id, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const importOrder = await importOrderService.getImportOrderById(id);
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
      // state.importOrderList = action.payload;
    },
    [getImportOrderById.pending]: (state) => {
      state.loading = true;
    },
    [getImportOrderById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getImportOrderById.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    }
  }
});

const { reducer: importOrderReducer } = importOrderSlice;
export default importOrderReducer;
