import { usePermissionsStore } from '@/stores/permissions' // Import usePermissionsStore
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
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'manage_users',
    },
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

router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionsStore()
  if (!permissionStore.permissionsFetched) {
    console.log('Fetching permissions in router...')
    await permissionStore.fetchPermissions()
  }

  if (to.meta.requiresAuth) {
    console.log('Checking auth...', to.meta.requiresAuth)
    console.log('Checking auth...', to.meta.permissions)

    const permissions = to.meta.permissions.split('|').map((perm) => perm.trim())
    const permissionName = to.meta.permissionName
    const permission = permissionStore.permissions.find((perm) => perm.name === permissionName)

    const hasPermission = permissions.some((perm) => {
      if (perm === 'read') return permission.can_read
      if (perm === 'write') return permission.can_write
      if (perm === 'create') return permission.can_create
      return false
    })

    if (!hasPermission) {
      return next('/login')
    }
  }

  next()
})

// Watch for changes in permissions and update routes accordingly
// watch:{
log('router.options.routes', router.options.routes)
// const usePermissionsStore = usePermissionsStore.permissions
// }
// () => usePermissionsStore().permissions,
// (newPermissions) => {
//   router.options.routes.forEach((route) => {
//     if (route.meta && route.meta.permissionName) {
//       const permission = newPermissions.find((perm) => perm.name === route.meta.permissionName)
//       if (permission) {
//         route.meta.permissions = permission
//       }
//     }
//   })
// },
// { deep: true },

export default router
