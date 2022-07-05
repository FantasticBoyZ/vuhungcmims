import exportOrderService from '@/services/exportOrderService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getExportOrderList = createAsyncThunk('exportOrder/list', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const exportOrder = await exportOrderService.getExportOrderList(params);
  return exportOrder;
})

export const getExportOrderById = createAsyncThunk('exportOrder/detail', async (id, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const exportOrder = await exportOrderService.getExportOrderById(id);
  return exportOrder;
})


const exportOrderSlice = createSlice({
  name: 'exportOrders',
  initialState: {
    exportOrderList: [],
    loading: false,
    error: null,
    edit: false
  },
  reducers: {
  },
  extraReducers: {
    [getExportOrderList.pending]: (state) => {
      state.loading = true;
    },
    [getExportOrderList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getExportOrderList.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getExportOrderById.pending]: (state) => {
      state.loading = true;
    },
    [getExportOrderById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getExportOrderById.fulfilled]: (state, action) => {
      state.loading = false;

    }
  }
});

const { reducer: exportOrderReducer } = exportOrderSlice;
export default exportOrderReducer;
