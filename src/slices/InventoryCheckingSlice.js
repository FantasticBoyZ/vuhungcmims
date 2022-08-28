import inventoryCheckingService from '@/services/inventoryCheckingService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getListInventoryChecking = createAsyncThunk(
  'inventoryChecking/list',
  async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const inventoryCheckingList = await inventoryCheckingService.getListInventoryChecking(params);
    return inventoryCheckingList;
  },
);

export const getProductByWarehouseId = createAsyncThunk(
  'get-product-by-warehouse/list',
  async (warehouseId, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const productList = await inventoryCheckingService.getProductByWarehouseId(
      warehouseId,
    );
    return productList;
  },
);

export const getConsignmentByProductId = createAsyncThunk(
  'get-consignment-by-product/list',
  async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const consignmentList = await inventoryCheckingService.getConsignmentByProductId(
      params,
    );
    return consignmentList;
  },
);

export const getInventoryCheckingHistoryDetail = createAsyncThunk(
  'inventoryChecking/detail',
  async (inventoryCheckingHistoryId, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const consignmentList =
      await inventoryCheckingService.getInventoryCheckingHistoryDetail(
        inventoryCheckingHistoryId,
      );
    return consignmentList;
  },
);

export const createInventoryChecking = createAsyncThunk(
  'inventoryChecking/create',
  async (inventoryChecking, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const response = await inventoryCheckingService.createInventoryChecking(
      inventoryChecking,
    );
    return response;
  },
);

const inventoryCheckingSlice = createSlice({
  name: 'inventoryChecking',
  initialState: {
    loading: false,
    error: null,
    edit: false,
  },
  reducers: {},
  extraReducers: {
    [getProductByWarehouseId.pending]: (state) => {
      state.loading = true;
    },
    [getProductByWarehouseId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getProductByWarehouseId.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getConsignmentByProductId.pending]: (state) => {
      state.loading = true;
    },
    [getConsignmentByProductId.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getConsignmentByProductId.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [createInventoryChecking.pending]: (state) => {
      state.loading = true;
    },
    [createInventoryChecking.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [createInventoryChecking.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getInventoryCheckingHistoryDetail.pending]: (state) => {
      state.loading = true;
    },
    [getInventoryCheckingHistoryDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getInventoryCheckingHistoryDetail.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getListInventoryChecking.pending]: (state) => {
      state.loading = true;
    },
    [getListInventoryChecking.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getListInventoryChecking.fulfilled]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer: inventoryCheckingReducer } = inventoryCheckingSlice;
export default inventoryCheckingReducer;
