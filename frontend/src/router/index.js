import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import CreateSection from '../views/CreateSection.vue'
import CreateBook from '../views/CreateBook.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard
  },
  {
    path: '/admin/section/create',
    name: 'CreateSection',
    component: CreateSection
  },
  {
    path: '/admin/book/create',
    name: 'CreateBook',
    component: CreateBook
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
