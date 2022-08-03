import warehouseService from '@/services/warehouseService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getWarehouseList = createAsyncThunk('warehouse', async (thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const warehouseList = await warehouseService.getWarehouseList();
    return warehouseList;
})

export const getAllWarehouseNotPaging = createAsyncThunk('warehouse/not-paging', async (thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const warehouseList = await warehouseService.getAllWarehouse();
    return warehouseList;
})

export const getWarehouseDetail = createAsyncThunk('warehouse/get-one', async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const warehouse = await warehouseService.getWarehouseDetail(params);
    return warehouse;
})

export const addWarehouse = createAsyncThunk('warehouse/save', async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const response = await warehouseService.addWarehouse(params);
    return response;
})

export const deleteWarehouse = createAsyncThunk('warehouse/delete', async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const response = await warehouseService.deleteWarehouse(params);
    return response;
})

export const getProvinceList = createAsyncThunk('province', async (thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const provinceList = await warehouseService.getProvince();
    return provinceList;
})

export const getDistrictList = createAsyncThunk('district', async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const districtList = await warehouseService.getDistrict(params);
    return districtList;
})

export const getWardList = createAsyncThunk('ward', async (params, thunkAPi) => {
    // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
    const wardList = await warehouseService.getWard(params);
    return wardList;
})

const warehouseSlice = createSlice({
    name: 'warehouse',
    initialState: {
        loading: false,
        error: null,
        edit: false
    },
    reducers: {

    },
    extraReducers: {
        [getWarehouseList.pending]: (state) => {
            state.loading = true;
        },
        [getWarehouseList.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getWarehouseList.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [getAllWarehouseNotPaging.pending]: (state) => {
            state.loading = true;
        },
        [getAllWarehouseNotPaging.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getAllWarehouseNotPaging.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [getWarehouseDetail.pending]: (state) => {
            state.loading = true;
        },
        [getWarehouseDetail.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getWarehouseDetail.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [deleteWarehouse.pending]: (state) => {
            state.loading = true;
        },
        [deleteWarehouse.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [deleteWarehouse.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [getProvinceList.pending]: (state) => {
            state.loading = true;
        },
        [getProvinceList.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getProvinceList.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [getDistrictList.pending]: (state) => {
            state.loading = true;
        },
        [getDistrictList.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getDistrictList.fulfilled]: (state, action) => {
            state.loading = false;
        },
        [getWardList.pending]: (state) => {
            state.loading = true;
        },
        [getWardList.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getWardList.fulfilled]: (state, action) => {
            state.loading = false;
        },
    }
});

const { reducer: warehouseReducer } = warehouseSlice;
export default warehouseReducer;
