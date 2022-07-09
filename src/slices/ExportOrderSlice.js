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

export const getConsignmentsByExportOrderId = createAsyncThunk('exportOrder/list-consignment', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const consignments = await exportOrderService.getListConsignmentByExportOrderId(params);
  return consignments;
})

export const getListProductInStock = createAsyncThunk('exportOrder/list-product-instock', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const productInstock = await exportOrderService.getListProductInStock(params);
  return productInstock;
})

export const getListConsiggnmentOfProductInStock = createAsyncThunk('exportOrder/list-consignment-of-product-instock', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const consignmenttInstock = await exportOrderService.getListConsignmentOfProductInStock(params);
  return consignmenttInstock;
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

    },
    [getConsignmentsByExportOrderId.pending]: (state) => {
      state.loading = true;
    },
    [getConsignmentsByExportOrderId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getConsignmentsByExportOrderId.fulfilled]: (state, action) => {
      state.loading = false;

    },
    [getListProductInStock.pending]: (state) => {
      state.loading = true;
    },
    [getListProductInStock.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getListProductInStock.fulfilled]: (state, action) => {
      state.loading = false;

    },
    [getListConsiggnmentOfProductInStock.pending]: (state) => {
      state.loading = true;
    },
    [getListConsiggnmentOfProductInStock.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getListConsiggnmentOfProductInStock.fulfilled]: (state, action) => {
      state.loading = false;

    }
  }
});

const { reducer: exportOrderReducer } = exportOrderSlice;
export default exportOrderReducer;
