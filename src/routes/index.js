import NotFound from '@/components/Layout/NotFound/NotFound';
import Profile from '@/components/TestComponent/Profile';
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
import WarehouseList from '@/pages/Warehouse/wareHouseList';

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
  { path: '/dashboard', component: HomePage },
  { path: '/about', component: About },
  { path: '/profile', component: Profile },
  { path: 'post/add', component: TestPost },
  { path: 'post/:postId', component: TestPost },

  // Product route
  { path: '/product', component: productList },
  { path: '/product/detail/:productId', component: ProductDetail },
  { path: '/product/add', component: AddEditProductForm },
  { path: '/product/edit/:productId', component: AddEditProductForm },

  // Category route
  { path: '/category', component: CategoryList },
  { path: '/category/detail/:categoryId', component: CategoryDetail },
  { path: '/category/add', component: AddEditCategoryForm },
  { path: '/category/edit/:categoryId', component: AddEditCategoryForm },

  // Manufactor route
  { path: '/manufacturer', component: ManufactorList },
  { path: '/manufacturer/detail/:manufacturerId', component: ManufacturerDetail },
  { path: '/manufacturer/add', component: AddEditManufacturerForm },
  { path: '/manufacturer/edit/:manufacturerId', component: AddEditManufacturerForm },

  // importOrder route
  { path: '/import/list', component: ImportList },
  { path: '/import/create-order', component: ImportGoods },
  { path: '/import/detail/:importOrderId', component: ImportOrderDetail },
  { path: '/import/edit/:importOrderId', component: UpdateImportOrderDetail },

  // exportOrder route
  { path: '/export/list', component: ExportList },
  { path: '/export/create-order', component: ExportGoods },
  { path: '/export/detail/:exportOrderId', component: ExportOrderDetail },
  { path: '/export/return/:exportOrderId', component: ReturnGoods },

  { path: '/denied', component: Profile, layout: null },
  { path: '*', component: NotFound, layout: null },
  { path: 'staff', component: StaffList },
  { path: 'staff/:staffId', component: StaffDetail },

  //warehouse route
  { path: '/wareHouse', component: WarehouseList },
];

export { publicRoutes, privateRoutes };
