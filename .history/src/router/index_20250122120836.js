import { usePermissionsStore } from '@/stores/permissions' // Import usePermissionsStore
import AddMerchant from '@/views/AddMerchant.vue'
import ForgetPassWord from '@/views/ForgetPassWord.vue'
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
    path: '/forget-password',
    name: 'ForgetPassWord',
    component: ForgetPassWord,
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
    await permissionStore.fetchPermissions()
  }

  if (to.meta.requiresAuth) {
    const permissions = to.meta.permissions.split('|').map((perm) => perm.trim())
    const permissionName = to.meta.permissionName
    const permission = permissionStore.permissions.find((perm) => perm.name === permissionName)

    const hasPermission = permissions.some((act) => {
      switch (act) {
        case 'read':
          if (parseInt(permission.can_read) === 1 || permission.can_read === true) {
            // console.log('Read permission granted: User has read, write, or create access')
            return true
          } else {
            // console.log('Read permission denied: User lacks required access')
            return false
          }
        case 'write':
          // console.log('Checking write permission:', permission.can_write)

          if (parseInt(permission.can_write) === 1 || permission.can_write === true) {
            // console.log('write permission granted: User has read, write, or create access')
            return true
          } else {
            // console.log('write permission denied: User lacks required access')
            return false
          }
        case 'create':
          if (parseInt(permission.can_create) === 1 || permission.can_create === true) {
            // console.log('createß permission granted: User has read, write, or create access')
            return true
          } else {
            // console.log('createß permission denied: User lacks required access')
            return false
          }
        default:
          // console.log('Unknown permission action:', act)
          return true
      }
    })

    if (!hasPermission) {
      return next('/login')
    }
  }

  next()
})

export default router
