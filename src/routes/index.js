import NotFound from '@/components/Layout/NotFound/NotFound';

import About from '@/pages/About/About';
import Login from '@/pages/Auth/Login';
import AddEditCategoryForm from '@/pages/Category/AddEditCategory/AddEditCategoryForm';
import CategoryDetail from '@/pages/Category/CategoryDetail/CategoryDetail';
import CategoryList from '@/pages/Category/categoryList';
import HomePage from '@/pages/Home/Home';
import ImportGoods from '@/pages/Import/ImportGoods/ImportGoods';
import AddEditManufacturerForm from '@/pages/Manufacturer/AddEditManufacturer/AddEditManufacturerForm';
import ManufactorList from '@/pages/Manufacturer/manufactorList';
import ManufacturerDetail from '@/pages/Manufacturer/ManufacturerDetail/ManufacturerDetail';
import AddEditProductForm from '@/pages/Product/AddEditProduct/AddEditProductForm';
import ProductDetail from '@/pages/Product/ProductList/ProductDetail/ProductDetail';
import productList from '@/pages/Product/ProductList/productList';
import TestPost from '@/pages/TestPost/testPost';
import ImportList from '@/pages/Transaction/ImportList/importList';
import ImportOrderDetail from '@/pages/Transaction/ImportList/ImportOrderDetail/ImportOrderDetail';
import StaffList from '@/pages/Staff/staffList';
import StaffDetail from '@/pages/Staff/staffDetail';
import ExportList from '@/pages/Transaction/ExportList/ExportList';
import ExportOrderDetail from '@/pages/Transaction/ExportList/ExportOrderDetail/ExportOrderDetail';
import ExportGoods from '@/pages/Export/ExportGoods/ExportGoods';
import CommonForgotPass from '@/pages/Auth/CommonForgotPass';
import UpdateImportOrderDetail from '@/pages/Transaction/ImportList/UpdateImportOrderDetail/UpdateImportOrderDetail';
import ReturnGoods from '@/pages/Export/ReturnGoods/ReturnGoods';
import UpdateExportOrderDetail from '@/pages/Transaction/ExportList/UpdateExportOrderDetail/UpdateExportOrderDetail';
import ReturnList from '@/pages/Export/ReturnList/ReturnList';
import ReturnOrderDetail from '@/pages/Export/ReturnList/ReturnOrderDetail/ReturnOrderDetail';
import InventoryCheckingList from '@/pages/InventoryChecking/InventoryCheckingList/InventoryCheckingList';
import CreateInventoryChecking from '@/pages/InventoryChecking/CreateInventoryChecking/CreateInventoryChecking';
import InventoryCheckingDetail from '@/pages/InventoryChecking/InventoryCheckingList/InventoyCheckingDetail/InventoryCheckingDetail';
import WarehouseList from '@/pages/Warehouse/wareHouseList';
import AddStaff from '@/pages/Staff/AddStaff/AddStaff';
import Profile from '@/pages/Profile/Profile';
import ResetPassword from '@/pages/Profile/ResetPassword/ResetPassword';
import UpdateProfile from '@/pages/Profile/UpdateProfile/UpdateProfile';
import AccessDenied from '@/components/Layout/AccessDenied/AccessDenied';
import TempInventoryReturnCreate from '@/pages/TempInventoryReturn/TempInventoryReturnCreate/TempInventoryReturnCreate';
import TempInventoryReturnList from '@/pages/TempInventoryReturn/TempInventoryReturnList/TempInventoryReturnList';
import TempInventoryReturnDetail from '@/pages/TempInventoryReturn/TempInventoryReturnDetail/TempInventoryReturnDetail';
import TempInventoryReturnEdit from '@/pages/TempInventoryReturn/TempInventoryReturnEdit/TempInventoryReturnEdit';

const publicRoutes = [
  { path: '/login', component: Login, layout: null },
  { path: '/', component: Login, layout: null },
  // { path: '/', component: HomePage,  primary: 'Home', icon: <Home/>},
  // { path: '/about', component: About, primary: 'About', icon: <Info/>,},
  // { path: '/profile', component: Profile, primary: 'Profile', icon: <Info/>,},
  { path: '/register', component: Login, layout: null },
  { path: '/forgotPassword', component: CommonForgotPass, layout: null },
];

const privateRoutes = [
  { path: '/dashboard', component: HomePage, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/about', component: About, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: 'post/add', component: TestPost , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: 'post/:postId', component: TestPost, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },

  // Product route
  { path: '/product', component: productList, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: '/product/detail/:productId', component: ProductDetail, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: '/product/add', component: AddEditProductForm , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/product/edit/:productId', component: AddEditProductForm , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },

  // Category route
  { path: '/category', component: CategoryList, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: '/category/detail/:categoryId', component: CategoryDetail , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/category/add', component: AddEditCategoryForm , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/category/edit/:categoryId', component: AddEditCategoryForm , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },

  // Manufactor route
  { path: '/manufacturer', component: ManufactorList, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: '/manufacturer/detail/:manufacturerId', component: ManufacturerDetail, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: '/manufacturer/add', component: AddEditManufacturerForm , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/manufacturer/edit/:manufacturerId', component: AddEditManufacturerForm , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },

  // importOrder route
  { path: '/import/list', component: ImportList, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: '/import/create-order', component: ImportGoods, acceptRole: ["ROLE_OWNER","ROLE_SELLER"]  },
  { path: '/import/detail/:importOrderId', component: ImportOrderDetail , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/import/edit/:importOrderId', component: UpdateImportOrderDetail , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },

  // exportOrder route
  { path: '/export/list', component: ExportList , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/export/create-order', component: ExportGoods , acceptRole: ["ROLE_OWNER","ROLE_SELLER"] },
  { path: '/export/detail/:exportOrderId', component: ExportOrderDetail , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/export/edit/:exportOrderId', component: UpdateExportOrderDetail , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/export/return/:exportOrderId', component: ReturnGoods , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/export/return/list', component: ReturnList, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: '/export/return/detail/:returnOrderId', component: ReturnOrderDetail , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },

  // inventoryChecking route
  { path: '/inventory-checking/list', component: InventoryCheckingList, acceptRole: ["ROLE_OWNER", "ROLE_STOREKEEPER"]  },
  { path: '/inventory-checking/detail/:inventoryCheckingId', component: InventoryCheckingDetail , acceptRole: ["ROLE_OWNER", "ROLE_STOREKEEPER"] },
  { path: '/inventory-checking/create', component: CreateInventoryChecking , acceptRole: ["ROLE_OWNER", "ROLE_STOREKEEPER"] },

  { path: '/denied', component: AccessDenied, layout: null, acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"]  },
  { path: '*', component: NotFound, layout: null , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },

  // staff route
  { path: 'staff/list', component: StaffList , acceptRole: ["ROLE_OWNER"] },
  { path: 'staff/detail/:staffId', component: StaffDetail, acceptRole: ["ROLE_OWNER"]  },
  { path: 'staff/register', component: AddStaff , acceptRole: ["ROLE_OWNER"] },
  { path: 'staff/:staffId', component: StaffDetail , acceptRole: ["ROLE_OWNER"] },

  // warehouse route
  { path: '/wareHouse', component: WarehouseList , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },

  // profile route
  { path: '/profile', component: Profile , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/reset-password', component: ResetPassword , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/profile/edit', component: UpdateProfile , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },

  // tempInventoryReturn route
  { path: '/term-inventory/return/create', component: TempInventoryReturnCreate , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/term-inventory/return/list', component: TempInventoryReturnList , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/term-inventory/return/detail/:tempInventoryReturnId', component: TempInventoryReturnDetail , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
  { path: '/term-inventory/return/edit/:tempInventoryReturnId', component: TempInventoryReturnEdit , acceptRole: ["ROLE_OWNER","ROLE_SELLER", "ROLE_STOREKEEPER"] },
];

export { publicRoutes, privateRoutes };
