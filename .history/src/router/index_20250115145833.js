// import store from '@/store/roles'
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
    meta: { requiresRole: 'MerchantOwner' },
  },
  {
    path: '/merchant/add',
    name: 'AddMerchant',
    component: () => import('@/views/AddMerchant.vue'),
  },
  // {
  //   path: '/roles',
  //   name: 'RolesList',
  //   component: RolesList,
  //   meta: { requiresPermission: 'manage_roles' },
  // },
  // {
  //   path: '/roles/add',
  //   name: 'AddRole',
  //   component: AddRole,
  // },
  // {
  //   path: '/roles/edit/:id',
  //   name: 'EditRole',
  //   component: EditRole,
  // },
  // {
  //   path: '/permissions',
  //   name: 'PermissionsList',
  //   component: PermissionsList,
  // },
  // {
  //   path: '/permissions/add',
  //   name: 'AddPermission',
  //   component: AddPermission,
  // },
  // {
  //   path: '/permissions/edit/:id',
  //   name: 'EditPermission',
  //   component: EditPermission,
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const userRole = store.getters.userRole
  const userPermissions = store.getters.userPermissions

  if (to.meta.requiresRole && to.meta.requiresRole !== userRole) {
    return next('/login')
  }

  if (to.meta.requiresPermission && !userPermissions.includes(to.meta.requiresPermission)) {
    return next('/login')
  }

  next()
})

export default router
