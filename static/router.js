import Home from './components/Home.js'
import Login from './components/Login.js'
import Register from './components/Register.js'
import Logout from './components/Logout.js'

const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/logout', component: Logout},
]

export default new VueRouter({
    routes,
})