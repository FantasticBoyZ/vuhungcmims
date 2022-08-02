import staffService from '@/services/staffService';
import tempInventoryReturnService from '@/services/tempInventoryReturnService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getTempInventoryReturnList = createAsyncThunk(
  'tempInventoryReturn/list',
  async (params, thunkAPi) => {
    const tempInventoryReturnList =
      await tempInventoryReturnService.getTempInventoryReturnList(params);
    return tempInventoryReturnList;
  },
);

export const getTempInventoryReturnById = createAsyncThunk(
  'tempInventoryReturn/detail',
  async (tempInventoryReturnId, thunkAPi) => {
    const tempInventoryReturn =
      await tempInventoryReturnService.getTempInventoryReturnById(tempInventoryReturnId);
    return tempInventoryReturn;
  },
);

export const createTempInventoryReturn = createAsyncThunk(
  'tempInventoryReturn/create',
  async (tempInventoryReturn, { rejectWithValue }) => {
    try {
      const response = await tempInventoryReturnService.createTempInventoryReturn(
        tempInventoryReturn,
      );
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  },
);

export const updateTempInventoryReturn = createAsyncThunk(
  'tempInventoryReturn/update',
  async (params, { rejectWithValue }) => {
    try {
      return await tempInventoryReturnService.updateTempInventoryReturn(params);
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  },
);

export const confirmTempInventoryReturn = createAsyncThunk(
  'tempInventoryReturn/confirm',
  async (params, thunkAPi) => {
    const response =
      await tempInventoryReturnService.confirmTempInventoryReturn(params);
    return response;
  },
);

export const cancelTempInventoryReturn = createAsyncThunk(
  'tempInventoryReturn/cancel',
  async (params, thunkAPi) => {
    const response =
      await tempInventoryReturnService.cancelTempInventoryReturn(params);
    return response;
  },
);

const tempInventoryReturnSlice = createSlice({
  name: 'tempInventoryReturn',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [getTempInventoryReturnList.pending]: (state) => {
      state.loading = true;
    },
    [getTempInventoryReturnList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getTempInventoryReturnList.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [getTempInventoryReturnById.pending]: (state) => {
      state.loading = true;
    },
    [getTempInventoryReturnById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getTempInventoryReturnById.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [createTempInventoryReturn.pending]: (state) => {
      state.loading = true;
    },
    [createTempInventoryReturn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [createTempInventoryReturn.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [updateTempInventoryReturn.pending]: (state) => {
      state.loading = true;
    },
    [updateTempInventoryReturn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateTempInventoryReturn.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [confirmTempInventoryReturn.pending]: (state) => {
      state.loading = true;
    },
    [confirmTempInventoryReturn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [confirmTempInventoryReturn.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [cancelTempInventoryReturn.pending]: (state) => {
      state.loading = true;
    },
    [cancelTempInventoryReturn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [cancelTempInventoryReturn.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
  },
});

const { reducer: tempInventoryReturnReducer } = tempInventoryReturnSlice;
export default tempInventoryReturnReducer;
