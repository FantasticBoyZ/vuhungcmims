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

export const createExportOrder = createAsyncThunk('exportOrder/create-export-order', async (exportOrder, thunkAPi) => {
  const response = await exportOrderService.createExportOrder(exportOrder);
  return response;
})

export const confirmExportOrder = createAsyncThunk('exportOrder/confirm', async (params, thunkAPi) => {

  return await exportOrderService.confirmExportOrder(params);
})

export const cancelExportOrder = createAsyncThunk('exportOrder/cancel', async (params, thunkAPi) => {

  return await exportOrderService.cancelExportOrder(params);
})

export const updateExportOrder = createAsyncThunk('exportOrder/update', async (exportOrder, thunkAPi) => {

  return await exportOrderService.updateExportOrder(exportOrder);
})

export const getReturnOrderList = createAsyncThunk('returnOrder/list', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const exportOrder = await exportOrderService.getReturnOrderList(params);
  return exportOrder;
})

export const getReturnOrderById = createAsyncThunk('returnOrder/detail', async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const exportOrder = await exportOrderService.getReturnOrderDetail(params);
  return exportOrder;
})

export const createReturnOrder = createAsyncThunk('returnOrder/create', async (returnOrder, thunkAPi) => {
  const response = await exportOrderService.createReturnOrder(returnOrder);
  return response;
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

    },
    [createExportOrder.pending]: (state) => {
      state.loading = true;
    },
    [createExportOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [createExportOrder.fulfilled]: (state, action) => {
      state.loading = false;

    },
    [confirmExportOrder.pending]: (state) => {
      state.loading = true;
    },
    [confirmExportOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [confirmExportOrder.fulfilled]: (state, action) => {
      state.loading = false;

    },
    [cancelExportOrder.pending]: (state) => {
      state.loading = true;
    },
    [cancelExportOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [cancelExportOrder.fulfilled]: (state, action) => {
      state.loading = false;

    },
    [updateExportOrder.pending]: (state) => {
      state.loading = true;
    },
    [updateExportOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateExportOrder.fulfilled]: (state, action) => {
      state.loading = false;

    },
    [getReturnOrderList.pending]: (state) => {
      state.loading = true;
    },
    [getReturnOrderList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getReturnOrderList.fulfilled]: (state, action) => {
      state.loading = false;

    }
    ,
    [getReturnOrderById.pending]: (state) => {
      state.loading = true;
    },
    [getReturnOrderById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getReturnOrderById.fulfilled]: (state, action) => {
      state.loading = false;

    },
    [createReturnOrder.pending]: (state) => {
      state.loading = true;
    },
    [createReturnOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [createReturnOrder.fulfilled]: (state, action) => {
      state.loading = false;

    }
  }
});

const { reducer: exportOrderReducer } = exportOrderSlice;
export default exportOrderReducer;
