import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'
import Merchants from '../views/MerchantsList.vue'
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
    {
      path: '/merchants',
      name: 'merchants',
      component: Merchants,
    },
  ],
})

export default router
