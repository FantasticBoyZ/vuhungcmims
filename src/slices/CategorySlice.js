import categoryService from '@/services/categoryService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getCategoryList = createAsyncThunk('category' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const categoryList = await categoryService.getCategoryList(params);
  return categoryList;
})

export const getSubCategoryByCategoryId = createAsyncThunk('subCategory' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const subCategoryList = await categoryService.getSubCategoryByCategoryId(params);
  return subCategoryList;
})

export const getCategoryDetail = createAsyncThunk('category/get-one' , async (params, thunkAPi) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  const category = await categoryService.getCategoryDetail(params);
  return category;
})

export const saveCategory = createAsyncThunk('category/save' , async (category, { rejectWithValue }) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  try {
    const response = await categoryService.saveCategory(category);
  return response;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
  
})

export const saveSubCategory = createAsyncThunk('sub-category/save' , async (category, { rejectWithValue }) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  try {
    const response = await categoryService.saveSubCategory(category);
  return response;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
  
})

export const updateCategory = createAsyncThunk('category/update' , async (category, { rejectWithValue }) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  try {
    const response = await categoryService.updateCategory(category);
  return response;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
  
})

export const updateSubCategory = createAsyncThunk('sub-category/update' , async (category, { rejectWithValue }) => {
  // nếu muốn dispatch 1 action khác thì dùng thunkApi.dispatch(..)
  try {
    const response = await categoryService.updateSubCategory(category);
  return response;
  } catch (err) {
    if (!err.response) {
      throw err;
    }
    return rejectWithValue(err.response.data);
  }
  
})

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    loading: false,
    error: null,
    edit: false
  },
  reducers: {

  },
  extraReducers: {
    [getCategoryList.pending] : (state) => {
      state.loading = true;
    },
    [getCategoryList.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getCategoryList.fulfilled] :(state, action) => {
      state.loading = false;
    },
    [getCategoryDetail.pending] : (state) => {
      state.loading = true;
    },
    [getCategoryDetail.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getCategoryDetail.fulfilled] :(state, action) => {
      state.loading = false;
    },
    [saveCategory.pending] : (state) => {
      state.loading = true;
    },
    [saveCategory.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [saveCategory.fulfilled] :(state, action) => {
      state.loading = false;
    },
    [saveSubCategory.pending] : (state) => {
      state.loading = true;
    },
    [saveSubCategory.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [saveSubCategory.fulfilled] :(state, action) => {
      state.loading = false;
    },
    [updateCategory.pending] : (state) => {
      state.loading = true;
    },
    [updateCategory.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateCategory.fulfilled] :(state, action) => {
      state.loading = false;
    },
    [updateSubCategory.pending] : (state) => {
      state.loading = true;
    },
    [updateSubCategory.rejected] :(state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [updateSubCategory.fulfilled] :(state, action) => {
      state.loading = false;
    },
  }
});

const { reducer: categoryReducer} = categorySlice;
export default categoryReducer;
