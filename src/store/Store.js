import userReducer from '@/slices/UserSlice'
import postReducer from '@/slices/PostSlice'
import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
    users: userReducer,
    posts: postReducer,
}

const store = configureStore({
    reducer: rootReducer
})

export default store;