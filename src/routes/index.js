import HomePage from "@/pages/Home/Home.js"
import Login from "@/components/AuthComponent/Login"
import About from "@/pages/About/About.js"
import NotFound from "@/components/Layout/NotFound/NotFound"
import { Home, Info } from "@mui/icons-material"
import Profile from "@/components/Profile"

const publicRoutes = [
    
    { path: '/login', component: Login, layout: null},
    // { path: '/', component: HomePage,  primary: 'Home', icon: <Home/>},
    // { path: '/about', component: About, primary: 'About', icon: <Info/>,},
    // { path: '/profile', component: Profile, primary: 'Profile', icon: <Info/>,},
    { path: '*', component: NotFound, layout: null}
]

const privateRoutes = [
    { path: '/', component: HomePage,  primary: 'Home', icon: <Home/>},
    { path: '/about', component: About, primary: 'About', icon: <Info/>,},
    { path: '/profile', component: Profile, primary: 'Profile', icon: <Info/>,},
]

export { publicRoutes, privateRoutes}