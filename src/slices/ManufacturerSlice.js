import manufactorService from '@/services/manufactorService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getManufacturerList = createAsyncThunk(
  'manufacturer/get-list',
  async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const manufacturerList = await manufactorService.getManufactorList(params);
    return manufacturerList;
  },
);

export const getManufacturerById = createAsyncThunk(
  'manufacturer/get-one',
  async (id, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const manufacturerList = await manufactorService.getManufacturerById(id);
    return manufacturerList;
  },
);

export const saveManufacturer = createAsyncThunk(
  'manufacturer/save',
  async (manufacturer, { rejectWithValue }) => {
    try {
      const response = await manufactorService.saveManufacturer(manufacturer);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }

      return rejectWithValue(err.response.data);
    }
  },
);

const manufacturerSlice = createSlice({
  name: 'manufacturers',
  initialState: {
    loading: false,
    error: null,
    edit: false,
  },
  reducers: {},
  extraReducers: {
    [getManufacturerList.pending]: (state) => {
      state.loading = true;
    },
    [getManufacturerList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getManufacturerList.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [getManufacturerById.pending]: (state) => {
      state.loading = true;
    },
    [getManufacturerById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getManufacturerById.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [saveManufacturer.pending]: (state) => {
      state.loading = true;
    },
    [saveManufacturer.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [saveManufacturer.fulfilled]: (state, action) => {
      state.loading = false;
    },
  },
});

const { reducer: manufacturerReducer } = manufacturerSlice;
export default manufacturerReducer;
