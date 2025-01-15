import MerchantsList from '@/views/MerchantsList.vue'
import AddPermission from '@/views/permission/AddPermission.vue'
import EditPermission from '@/views/permission/EditPermission.vue'
import PermissionsList from '@/views/permission/PermissionsList.vue'
import AddRole from '@/views/role/AddRole.vue'
import EditRole from '@/views/role/EditRole.vue'
import RolesList from '@/views/role/RolesList.vue'
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
  {
    path: '/roles',
    name: 'RolesList',
    component: RolesList,
  },
  {
    path: '/roles/add',
    name: 'AddRole',
    component: AddRole,
  },
  {
    path: '/roles/edit/:id',
    name: 'EditRole',
    component: EditRole,
  },
  {
    path: '/permissions',
    name: 'PermissionsList',
    component: PermissionsList,
  },
  {
    path: '/permissions/add',
    name: 'AddPermission',
    component: AddPermission,
  },
  {
    path: '/permissions/edit/:id',
    name: 'EditPermission',
    component: EditPermission,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
