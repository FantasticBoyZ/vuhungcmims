import userReducer from '@/slices/UserSlice'
import postReducer from '@/slices/PostSlice'
import { configureStore } from '@reduxjs/toolkit';
import productReducer from '@/slices/ProductSlice';
import importOrderReducer from '@/slices/ImportOrderSlice';

const rootReducer = {
    users: userReducer,
    posts: postReducer,
    products: productReducer,
    importOrders: importOrderReducer
}

const store = configureStore({
    reducer: rootReducer
})

export default store;