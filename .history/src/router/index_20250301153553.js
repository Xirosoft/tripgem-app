import { usePermissionsStore } from '@/stores/permissions' // Import usePermissionsStore
import AddMerchant from '@/views/merchant/AddMerchant.vue'
import EditMerchant from '@/views/merchant/EditMerchant.vue' // Import EditMerchant component
import MerchantsList from '@/views/merchant/MerchantsList.vue'
import ViewMerchant from '@/views/merchant/ViewMerchant.vue'
import PermissionsList from '@/views/permission/PermissionsList.vue'
import RolesList from '@/views/role/RolesList.vue'
import EditUser from '@/views/users/EditUser.vue'
import UserList from '@/views/users/UserList.vue'
import ViewUser from '@/views/users/ViewUser.vue' // Import ViewUser component
import { createRouter, createWebHistory } from 'vue-router'
import AdminDashboard from '../views/AdminDashboard.vue'
import ForgetPassWord from '../views/ForgetPassWord.vue'
import Login from '../views/Login.vue'
import MiscError from '../views/MiscError.vue'
import Register from '../views/Register.vue'
import RestPassWord from '../views/RestPassWord.vue'
import TwoStepAuth from '../views/TwoStepAuth.vue'

import AddTour from '@/views/tour/AddTour.vue'
import EditTour from '@/views/tour/EditTour.vue'
import TourCategory from '@/views/tour/TourCategory.vue'
import TourList from '@/views/tour/TourList.vue'
import TourLocation from '@/views/tour/TourLocation.vue'
import TourTags from '@/views/tour/TourTags.vue'
import ViewTour from '@/views/tour/ViewTour.vue'

import AllBookings from '@/views/booking/AllBookings.vue'

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
    path: '/users/edit/:userId',
    name: 'EditUser',
    component: EditUser,
    props: true,
    meta: {
      requiresAuth: true,
      permissions: 'write',
      permissionName: 'manage_users',
    },
  },
  {
    path: '/users/profile/:userId',
    name: 'ViewUser',
    component: ViewUser,
    props: true,
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
    path: '/reset-password',
    name: 'RestPassWord',
    component: RestPassWord,
  },
  {
    path: '/merchants',
    name: 'MerchantsList',
    component: MerchantsList,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'merchant_module',
    },
  },
  {
    path: '/merchant/add',
    name: 'AddMerchant',
    component: AddMerchant,
    meta: {
      requiresAuth: true,
      permissions: 'create',
      permissionName: 'merchant_module',
    },
  },
  {
    path: '/merchant/edit/:id',
    name: 'EditMerchant',
    component: EditMerchant,
    props: true,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'merchant_module',
    },
  },
  {
    path: '/merchant/view/:id',
    name: 'ViewMerchant',
    component: ViewMerchant,
    props: true,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'merchant_module',
    },
  },
  {
    path: '/roles',
    name: 'RolesList',
    component: RolesList,
    meta: {
      requiresAuth: true,
      permissions: 'write',
      permissionName: 'roles_and_permissions',
    },
  },
  {
    path: '/permissions',
    name: 'PermissionsList',
    component: PermissionsList,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'roles_and_permissions',
    },
  },
  {
    path: '/all-tours',
    name: 'TourList',
    component: TourList,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  {
    path: '/add-tour',
    name: 'AddTour',
    component: AddTour,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  {
    path: '/view-tour/:id',
    name: 'ViewTour',
    component: ViewTour,
    props: true,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  {
    path: '/edit-tour/:id',
    name: 'EditTour',
    component: EditTour,
    props: true,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  {
    path: '/tour-location',
    name: 'TourLocation',
    component: TourLocation,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  {
    path: '/tour-category',
    name: 'TourCategory',
    component: TourCategory,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  {
    path: '/tour-tags',
    name: 'TourTags',
    component: TourTags,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  {
    path: '/all-boookings',
    name: 'AllBookings',
    component: AllBookings,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  {
    path: '/all-boookings',
    name: 'AllBookings',
    component: AllBookings,
    meta: {
      requiresAuth: true,
      permissions: 'read',
      permissionName: 'tour_module',
    },
  },
  { path: '/:pathMatch(.*)*', component: MiscError }, // Catch-all route
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
      return next('/')
    }
  }

  next()
})

export default router
