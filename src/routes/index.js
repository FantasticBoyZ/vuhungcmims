import HomePage from "@/pages/Home/Home.js"
import Login from "@/components/Login"
import About from "@/pages/About/About.js"

const publicRoutes = [
    
    { path: '/login', component: Login, layout: null},
    { path: '/', component: HomePage}
]

const privateRoutes = [
    { path: '/', component: HomePage},
    { path: '/about', component: About}
]

export { publicRoutes, privateRoutes}