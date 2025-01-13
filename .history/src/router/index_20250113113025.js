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
    {
      path: '/merchants',
      name: 'MerchantsList',
      component: () => import('@/views/MerchantsList.vue'),
    },
    {
      path: '/merchant/add',
      name: 'AddMerchant',
      component: () => import('@/views/AddMerchant.vue'),
    },
  ],
})

export default router
