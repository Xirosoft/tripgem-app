import AddMerchant from '@/views/AddMerchant.vue'
import MerchantsList from '@/views/MerchantsList.vue'
import PermissionsList from '@/views/permission/PermissionsList.vue'
import RolesList from '@/views/role/RolesList.vue'
import UserList from '@/views/users/UserList.vue'
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
    path: '/users',
    name: 'UserList',
    component: UserList,
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
    component: AddMerchant,
  },
  {
    path: '/roles',
    name: 'RolesList',
    component: RolesList,
  },
  {
    path: '/permissions',
    name: 'PermissionsList',
    component: PermissionsList,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
