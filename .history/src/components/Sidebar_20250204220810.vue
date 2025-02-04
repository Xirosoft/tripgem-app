<script>
import { useAuthStore } from '@/stores/auth'
import TripgemLogo from './Logo.vue'

export default {
  name: 'SideBar',
  components: {
    TripgemLogo,
  },

  data() {
    const authStore = useAuthStore()
    const userId = authStore.userId
    return {
      userId,
      menuItems: [
        {
          title: 'Dashboard',
          icon: 'ti ti-home',
          path: '/',
          active: false,
          permission: {
            module: 'user_dashboard',
            action: 'read',
          },
        },
        {
          title: 'Merchant',
          icon: 'ti ti-briefcase',
          active: false,
          permission: {
            module: 'merchant_module',
            action: 'read',
          },
          submenu: [
            {
              title: 'All Merchants',
              path: '/merchants',
              active: false,
              permission: {
                module: 'merchant_module',
                action: 'read',
              },
            },
            {
              title: 'Add Merchant',
              path: '/merchant/add',
              active: false,
              permission: {
                module: 'merchant_module',
                action: 'create',
              },
            },
            {
              title: 'Update Merchant',
              path: '/merchant/update',
              active: false,
              permission: {
                module: 'merchant_module',
                action: 'write',
              },
            },
            {
              title: 'Merchant Control',
              path: '/merchant/control',
              active: false,
              permission: {
                module: 'merchant_module',
                action: 'write',
              },
            },
          ],
        },
      ],
    }
  },
  mounted() {
    console.log('Mounted User D: ', this.uCan('read', 'user_dashboard'))
  },
}
</script>

<template></template>

<style>
.bg-menu-theme.menu-vertical .menu-item .router-link-active {
  background: linear-gradient(270deg, rgba(115, 103, 240, 0.7) 0%, #7367f0 100%);
  box-shadow: 0px 2px 6px 0px rgba(115, 103, 240, 0.3);
  color: #fff;
}
.bg-menu-theme
  .menu-inner
  .menu-sub
  .menu-item:not(.active)
  > .menu-link.router-link-active::before {
  color: #fff !important;
}
.bg-menu-theme.menu-vertical .menu-item .router-link-active:hover {
  background: linear-gradient(270deg, rgba(115, 103, 240, 0.7) 0%, #7367f0 100%);
  box-shadow: 0px 2px 6px 0px rgba(115, 103, 240, 0.3);
  color: #444050;
}
.bg-menu-theme
  .menu-inner
  .menu-sub
  .menu-item:not(.active)
  > .menu-link.router-link-active:hover::before {
  color: #6d6b77 !important;
}
</style>
