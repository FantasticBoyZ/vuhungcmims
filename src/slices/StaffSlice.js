import staffService from '@/services/staffService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getStaffList = createAsyncThunk('staff/list', async (params, thunkAPi) => {
  const staffList = await staffService.getStaffList(params);
  return staffList;
});

export const getStaffDetail = createAsyncThunk(
  'staff/detail',
  async (staffId, thunkAPi) => {
    const staff = await staffService.getStaffById(staffId);
    return staff;
  },
);

export const getProfile = createAsyncThunk('profile', async (staffId, thunkAPi) => {
  const profile = await staffService.getProfile(staffId);
  return profile;
});

export const setActiveForStaff = createAsyncThunk(
  'staff/set-active',
  async (params, thunkAPi) => {
    const staff = await staffService.setActiveForStaff(params);
    return staff;
  },
);

export const updateRoleForStaff = createAsyncThunk(
  'staff/update-role',
  async (params, thunkAPi) => {
    const staff = await staffService.updateRoleForStaff(params);
    return staff;
  },
);

export const signUpStaff = createAsyncThunk(
  'staff/sign-up',
  async (staff, { rejectWithValue }) => {
    try {
      const response = await staffService.signUpStaff(staff);
      return response;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  },
);

export const uploadImageNewStaff = createAsyncThunk(
  'staff/upload-new-image',
  async (formData) => {
    return await staffService.uploadImageNewStaff(formData);
  },
);

export const updateImageStaff = createAsyncThunk('staff/update-image', async (params) => {
  const { staffId, formData } = params;
  return await staffService.updateImageStaff(staffId, formData);
});

export const updateProfile = createAsyncThunk(
  'staff/update-profile',
  async (staff, { rejectWithValue }) => {
    try {
      return await staffService.updateProfile(staff);
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  },
);

export const setNewPassword = createAsyncThunk(
  'profile/set-new-password',
  async (newPassword, { rejectWithValue }) => {
    try {
      return await staffService.setNewPassword(newPassword);
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  },
);

export const resetPassword = createAsyncThunk(
  'staff/reset-password',
  async (staff, { rejectWithValue }) => {
    try {
      return await staffService.resetPassword(staff);
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      console.log(err);
      return rejectWithValue(err.response.data);
    }
  },
);


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
    [getStaffDetail.pending]: (state) => {
      state.loading = true;
    },
    [getStaffDetail.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getStaffDetail.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [setActiveForStaff.pending]: (state) => {
      state.loading = true;
    },
    [setActiveForStaff.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [setActiveForStaff.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [updateRoleForStaff.pending]: (state) => {
      state.loading = true;
    },
    [updateRoleForStaff.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateRoleForStaff.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [signUpStaff.pending]: (state) => {
      state.loading = true;
    },
    [signUpStaff.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [signUpStaff.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [uploadImageNewStaff.pending]: (state) => {
      state.loading = true;
    },
    [uploadImageNewStaff.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [uploadImageNewStaff.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [updateImageStaff.pending]: (state) => {
      state.loading = true;
    },
    [updateImageStaff.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateImageStaff.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [updateProfile.pending]: (state) => {
      state.loading = true;
    },
    [updateProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateProfile.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [getProfile.pending]: (state) => {
      state.loading = true;
    },
    [getProfile.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getProfile.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [setNewPassword.pending]: (state) => {
      state.loading = true;
    },
    [setNewPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [setNewPassword.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
    [resetPassword.pending]: (state) => {
      state.loading = true;
    },
    [resetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.loading = false;
      // state.importOrderList = action.payload;
    },
  },
});

const { reducer: staffReducer } = staffSlice;
export default staffReducer;
