import HomePage from "@/pages/Home/Home.js"
import Login from "@/components/Login"
import About from "@/pages/About/About.js"
import NotFound from "@/components/Layout/NotFound/NotFound"
import { Home, Info } from "@mui/icons-material"

const publicRoutes = [
    
    { path: '/login', component: Login, layout: null},
    { primary: 'Home', icon: <Home/>, path: '/', component: HomePage},
    { primary: 'About', icon: <Info/>, path: '/about', component: About},
    { primary: 'Test', icon: <Info/>, path: '/test', component: HomePage},
    { path: '*', component: NotFound, layout: null}
]

const privateRoutes = [
    { primary: 'Home', icon: <Home/>, path: '/', component: HomePage},
    { primary: 'About', icon: <Info/>, path: '/about', component: About},
    { primary: 'Test', icon: <Info/>, path: '/test', component: HomePage},
]

export { publicRoutes, privateRoutes}