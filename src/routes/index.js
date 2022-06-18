import NotFound from '@/components/Layout/NotFound/NotFound';
import Profile from '@/components/TestComponent/Profile';
import About from '@/pages/About/About';
import Login from '@/pages/Auth/Login';
import HomePage from '@/pages/Home/Home';
import AddEditProductForm from '@/pages/Product/AddEditProduct/AddEditProductForm';
import ProductDetail from '@/pages/Product/ProductList/ProductDetail/ProductDetail';
import productList from '@/pages/Product/ProductList/productList';
import TestPost from '@/pages/TestPost/testPost';
import ImportList from '@/pages/Transaction/ImportList/importList';
// import ImportOrderDetail from '@/pages/Transaction/ImportList/ImportOrderDetail/ImportOrderDetail';

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
  { path: 'product', component: productList },
  { path: 'product/:productId', component: ProductDetail },
  { path: 'product/add', component: AddEditProductForm },
  { path: '/product/edit/:productId', component: AddEditProductForm },
  { path: 'post/:postId', component: TestPost },
  { path: 'import', component: ImportList },
  // { path: '/import/detail/:importOrderId', component: ImportOrderDetail },
  { path: '/denied', component: Profile, layout: null },
  { path: '*', component: NotFound, layout: null },
];

export { publicRoutes, privateRoutes };

