import HomePage from '@/pages/Home/Home';
import Login from '@/components/AuthComponent/Login';
import About from '@/pages/About/About';
import NotFound from '@/components/Layout/NotFound/NotFound';
import { Home, Info } from '@mui/icons-material';
import Profile from '@/components/TestComponent/Profile';
import TestPost from '@/pages/TestPost/testPost';
import productList from '@/pages/Product/ProductList/productList';
import ImportList from '@/pages/Transaction/ImportList/importList';

const publicRoutes = [
  { path: '/login', component: Login, layout: null },
  // { path: '/', component: HomePage,  primary: 'Home', icon: <Home/>},
  // { path: '/about', component: About, primary: 'About', icon: <Info/>,},
  // { path: '/profile', component: Profile, primary: 'Profile', icon: <Info/>,},
  { path: '*', component: NotFound, layout: null },
];

const privateRoutes = [
  { path: '/', component: HomePage, primary: 'Home', icon: <Home /> },
  { path: '/about', component: About, primary: 'About', icon: <Info /> },
  { path: '/profile', component: Profile, primary: 'Profile', icon: <Info /> },
  { path: 'post/add', component: TestPost },
  { path: 'post/:postId', component: TestPost },
  { path: 'product', component: productList },
  { path: 'post/:postId', component: TestPost },
  { path: 'import', component: ImportList },
];

export { publicRoutes, privateRoutes };
