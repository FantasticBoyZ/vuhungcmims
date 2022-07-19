import staffService from '@/services/staffService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getStaffList = createAsyncThunk('staff/list', async (params, thunkAPi) => {
  const staffList = await staffService.getStaffList(params);
  return staffList;
});

export const getStaffDetail = createAsyncThunk('staff/detail', async (staffId, thunkAPi) => {
    const staff = await staffService.getStaffById(staffId);
    return staff;
  });

const staffSlice = createSlice({
  name: 'staff',
  initialState: {
    loading: false,
    error: null,
    edit: false,
  },
  reducers: {},
  extraReducers: {
    [getStaffList.pending]: (state) => {
      state.loading = true;
    },
    [getStaffList.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getStaffList.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
  },
});

const { reducer: staffReducer } = staffSlice;
export default staffReducer;
