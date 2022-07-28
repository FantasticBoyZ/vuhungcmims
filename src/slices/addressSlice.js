import AddressService from '@/services/addressService';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getProvinceList = createAsyncThunk('province/list', async (params, thunkAPi) => {
  const provinceList = await AddressService.getProvince(params);
  return provinceList;
});

export const getDistrictList = createAsyncThunk('district/list', async (params, thunkAPi) => {
  const districtList = await AddressService.getDistrict(params);
  return districtList;
});

export const getWardList = createAsyncThunk('ward/list', async (params, thunkAPi) => {
  const wardList = await AddressService.getWard(params);
  return wardList;
});

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    loadingAddress: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [getProvinceList.pending]: (state) => {
      state.loadingAddress = true;
    },
    [getProvinceList.rejected]: (state, action) => {
      state.loadingAddress = false;
      state.error = action.payload;
    },
    [getProvinceList.fulfilled]: (state, action) => {
      state.loadingAddress = false;
      // state.importOrderList = action.payload;
    },
    [getDistrictList.pending]: (state) => {
      state.loadingAddress = true;
    },
    [getDistrictList.rejected]: (state, action) => {
      state.loadingAddress = false;
      state.error = action.payload;
    },
    [getDistrictList.fulfilled]: (state, action) => {
      state.loadingAddress = false;
      // state.importOrderList = action.payload;
    },
    [getWardList.pending]: (state) => {
      state.loadingAddress = true;
    },
    [getWardList.rejected]: (state, action) => {
      state.loadingAddress = false;
      state.error = action.payload;
    },
    [getWardList.fulfilled]: (state, action) => {
      state.loadingAddress = false;
      // state.importOrderList = action.payload;
    },
  },
});

const { reducer: addressReducer } = addressSlice;
export default addressReducer;
