import { usePermissionsStore } from '@/stores/permissions' // Import usePermissionsStore
import AddMerchant from '@/views/AddMerchant.vue'
import MerchantsList from '@/views/MerchantsList.vue'
import PermissionsList from '@/views/permission/PermissionsList.vue'
import RolesList from '@/views/role/RolesList.vue'
import UserList from '@/views/users/UserList.vue'
import { createPinia } from 'pinia'
import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import TwoStepAuth from '../views/TwoStepAuth.vue'

const pinia = createPinia()

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
      permissions: 'read | write | create',
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
  {
    path: '/refresh',
    name: 'refresh',
    beforeEnter: (to, from, next) => {
      next(to.params.nextUrl)
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionsStore(pinia)
  if (!permissionStore.permissionsFetched) {
    console.log('Fetching permissions in router...')
    await permissionStore.fetchPermissions()
  }

  if (to.meta.requiresAuth) {
    console.log('Checking auth...', to.meta.requiresAuth)
    console.log('Checking auth...', to.meta.permissions)

    const permissions
          route.meta.permissions = `${permission.can_read ? 'read' : ''} | ${permission.can_write ? 'write' : ''} | ${permission.can_create ? 'create' : ''}`            .replace(/\s\|\s\|/g, '')            .trim()        }      }    })  },  { deep: true },)
console.log('Watching permissions...', usePermissionsStore(pinia))

export default router
