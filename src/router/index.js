import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AdminDashboard',
      component: AdminDashboard,
    },
    {
      path: '/login',
      name: 'tripgemlogin',
      component: Login,
    },
  ],
})

export default router
