import Home from './components/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import AdminDashboard from './components/AdminDashboard.js';
import UserDashboard from './components/UserDashboard.js';
import AddSection from './components/Section/AddSection.js';
import EditSection from './components/Section/EditSection.js';
import DeleteSection from './components/Section/DeleteSection.js';
import ViewBooks from './components/Section/ViewBooks.js';
import { requireAdminAuth, isAuthenticated } from './components/auth.js';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/admin', component: AdminDashboard, beforeEnter: requireAdminAuth },
    { path: '/user', component: UserDashboard, beforeEnter: isAuthenticated},
    { path: '/add-section', component: AddSection, beforeEnter: requireAdminAuth },
    { path: '/edit-section/:id', component: EditSection, beforeEnter: requireAdminAuth },
    { path: '/delete-section/:id', component: DeleteSection, beforeEnter: requireAdminAuth},
    { path: '/view-books/:id', component: ViewBooks, beforeEnter: isAuthenticated },
];

export default new VueRouter({
    routes,
});
