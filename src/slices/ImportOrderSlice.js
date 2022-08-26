import importOrderService from '@/services/importOrderService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getImportOrderList = createAsyncThunk(
  'importOrder/list',
  async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const importOrder = await importOrderService.getImportOrderList(params);
    return importOrder;
  },
);

export const getImportOrderById = createAsyncThunk(
  'importOrder/detail',
  async (id, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const importOrder = await importOrderService.getImportOrderById(id);
    return importOrder;
  },
);

export const confirmImportOrder = createAsyncThunk(
  'importOrder/confirm',
  async (params, { rejectWithValue }) => {
    try {
      return await importOrderService.confirmImportOrder(params);
    } catch (err) {
      if (!err.response) {
        throw err;
      }

      return rejectWithValue(err.response.data);
    }
  },
);

export const cancelImportOrder = createAsyncThunk(
  'importOrder/cancel',
  async (params, { rejectWithValue }) => {
    try {
      return await importOrderService.cancelImportOrder(params);
    } catch (err) {
      if (!err.response) {
        throw err;
      }

      return rejectWithValue(err.response.data);
    }
  },
);

export const updateImportOrder = createAsyncThunk(
  'importOrder/update',
  async (importOrder, { rejectWithValue }) => {
    try {
      return await importOrderService.updateImportOrder(importOrder);
    } catch (err) {
      if (!err.response) {
        throw err;
      }

      return rejectWithValue(err.response.data);
    }
  },
);

const importOrderSlice = createSlice({
  name: 'importOrders',
  initialState: {
    importOrderList: [],
    loading: false,
    error: null,
    edit: false,
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
    },
    [confirmImportOrder.pending]: (state) => {
      state.loading = true;
    },
    [confirmImportOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [confirmImportOrder.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [updateImportOrder.pending]: (state) => {
      state.loading = true;
    },
    [updateImportOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateImportOrder.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [cancelImportOrder.pending]: (state) => {
      state.loading = true;
    },
    [cancelImportOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [cancelImportOrder.fulfilled]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer: importOrderReducer } = importOrderSlice;
export default importOrderReducer;
