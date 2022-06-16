import NotFound from '@/components/Layout/NotFound/NotFound';
import Profile from '@/components/TestComponent/Profile';
import About from '@/pages/About/About';
import Login from '@/pages/Auth/Login';
import AddEditCategoryForm from '@/pages/Category/AddEditCategory/AddEditCategoryForm';
import CategoryDetail from '@/pages/Category/CategoryDetail/CategoryDetail';
import CategoryList from '@/pages/Category/categoryList';
import HomePage from '@/pages/Home/Home';
import ManufactorList from '@/pages/Manufacturer/manufactorList';
import AddEditProductForm from '@/pages/Product/AddEditProduct/AddEditProductForm';
import ProductDetail from '@/pages/Product/ProductList/ProductDetail/ProductDetail';
import productList from '@/pages/Product/ProductList/productList';
import TestPost from '@/pages/TestPost/testPost';
import ImportList from '@/pages/Transaction/ImportList/importList';
import ImportOrderDetail from '@/pages/Transaction/ImportList/ImportOrderDetail/ImportOrderDetail';

const publicRoutes = [
  { path: '/login', component: Login, layout: null },
  { path: '/', component: Login, layout: null },
  // { path: '/', component: HomePage,  primary: 'Home', icon: <Home/>},
  // { path: '/about', component: About, primary: 'About', icon: <Info/>,},
  // { path: '/profile', component: Profile, primary: 'Profile', icon: <Info/>,},
  { path: '/register', component: Login, layout: null },
];

const privateRoutes = [
  { path: '/dashboard', component: HomePage },
  { path: '/about', component: About },
  { path: '/profile', component: Profile },
  { path: 'post/add', component: TestPost },
  { path: 'post/:postId', component: TestPost },

  // Product route
  { path: '/product', component: productList },
  { path: '/product/:productId', component: ProductDetail },
  { path: '/product/add', component: AddEditProductForm },
  { path: '/product/edit/:productId', component: AddEditProductForm },

  // Category route
  { path: '/category', component: CategoryList },
  { path: '/category/:categoryId', component: CategoryDetail },
  { path: '/category/add', component: AddEditCategoryForm },
  { path: '/category/edit/:categoryId', component: AddEditCategoryForm },

  // Manufactor route
  { path: '/manufacturer', component: ManufactorList },
  // { path: '/manufacturer/:manufacturerId', component: CategoryDetail },
  // { path: '/manufacturer/add', component: AddEditCategoryForm },
  // { path: '/manufacturer/edit/:manufacturerId', component: AddEditCategoryForm },

  // importOrder route
  { path: 'import', component: ImportList },
  // { path: '/import/detail/:importOrderId', component: ImportOrderDetail },
  { path: '/denied', component: Profile, layout: null },
  { path: '*', component: NotFound, layout: null },
];

export { publicRoutes, privateRoutes };

