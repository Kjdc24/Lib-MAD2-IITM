import Home from './components/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import AdminDashboard from './components/AdminDashboard.js';
import UserDashboard from './components/UserDashboard.js';
import AddSection from './components/Section/AddSection.js';
import EditSection from './components/Section/EditSection.js';
import DeleteSection from './components/Section/DeleteSection.js';
import ViewBooks from './components/Section/ViewBooks.js';
import AddBook from './components/Section/AddBook.js';
import EditBook from './components/Section/EditBook.js';
import DeleteBook from './components/Section/DeleteBook.js';
import AllRequests from './components/Section/AllRequests.js';
import Distribution from './components/Section/Distribution.js';
import Profile from './components/User/Profile.js';
import UserBooks from './components/User/UserBooks.js';
import { requireAdminAuth, requireAuth, notAuthenticated } from './components/auth.js';

const routes = [
    { path: '/', component: Home, beforeEnter: notAuthenticated  },
    { path: '/login', component: Login, beforeEnter: notAuthenticated },
    { path: '/register', component: Register, beforeEnter: notAuthenticated },
    { path: '/admin', component: AdminDashboard, beforeEnter: requireAdminAuth },
    { path: '/user', component: UserDashboard, beforeEnter: requireAuth},
    { path: '/add-section', component: AddSection, beforeEnter: requireAdminAuth },
    { path: '/edit-section/:id', component: EditSection, beforeEnter: requireAdminAuth },
    { path: '/delete-section/:id', component: DeleteSection, beforeEnter: requireAdminAuth},
    { path: '/view-books/:id', component: ViewBooks, beforeEnter: requireAdminAuth },
    { path: '/add-book/:id', component: AddBook, beforeEnter: requireAdminAuth },
    { path: '/edit-book/:id', component: EditBook, beforeEnter: requireAdminAuth },
    { path: '/delete-book/:id', component: DeleteBook, beforeEnter: requireAdminAuth },
    { path: '/all-requests', component: AllRequests, beforeEnter: requireAdminAuth},
    { path: '/distribution', component: Distribution, beforeEnter: requireAdminAuth},
    { path: '/profile', component: Profile, beforeEnter: requireAuth },
    { path: '/my-books', component: UserBooks, beforeEnter: requireAuth },
];

export default new VueRouter({
    routes,
});
