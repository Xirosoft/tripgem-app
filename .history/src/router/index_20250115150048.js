import MerchantsList from '@/views/MerchantsList.vue'
import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import TwoStepAuth from '../views/TwoStepAuth.vue'

const routes = [
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
    path: '/register',
    name: 'tripgemregister',
    component: Register,
  },
  {
    path: '/auth-two-steps',
    name: 'TwoStepAuth',
    component: TwoStepAuth,
  },
  {
    path: '/merchants',
    name: 'MerchantsList',
    component: MerchantsList,
  },
  {
    path: '/merchant/add',
    name: 'AddMerchant',
    component: () => import('@/views/AddMerchant.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
