import userReducer from '@/slices/UserSlice'
import postReducer from '@/slices/PostSlice'
import { configureStore } from '@reduxjs/toolkit';
import productReducer from '@/slices/ProductSlice';
import importOrderReducer from '@/slices/ImportOrderSlice';
import categoryReducer from '@/slices/CategorySlice';
import manufacturerReducer from '@/slices/ManufacturerSlice';
import exportOrderReducer from '@/slices/ExportOrderSlice';
import warehouseReducer from '@/slices/WarehouseSlice';
import staffReducer from '@/slices/StaffSlice';
import inventoryCheckingReducer from '@/slices/InventoryCheckingSlice';
import addressReducer from '@/slices/addressSlice';
import tempInventoryReturnReducer from '@/slices/TempInventoryReturnSlice';

const rootReducer = {
    users: userReducer,
    posts: postReducer,
    products: productReducer,
    categories: categoryReducer,
    manufacturers: manufacturerReducer,
    importOrders: importOrderReducer,
    exportOrders: exportOrderReducer,
    warehouse: warehouseReducer,
    staff: staffReducer,
    inventoryChecking: inventoryCheckingReducer,
    address: addressReducer,
    tempInventoryReturn: tempInventoryReturnReducer,
}

const store = configureStore({
    reducer: rootReducer
})

export default store;