import userReducer from '@/slices/UserSlice'
import postReducer from '@/slices/PostSlice'
import { configureStore } from '@reduxjs/toolkit';
import productReducer from '@/slices/ProductSlice';
import importOrderReducer from '@/slices/ImportOrderSlice';
import categoryReducer from '@/slices/CategorySlice';
import manufacturerReducer from '@/slices/ManufacturerSlice';

const rootReducer = {
    users: userReducer,
    posts: postReducer,
    products: productReducer,
    categories: categoryReducer,
    manufacturers: manufacturerReducer,
    importOrders: importOrderReducer
}

const store = configureStore({
    reducer: rootReducer
})

export default store;