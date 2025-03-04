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
          title: 'Tour Search',
          icon: 'ti ti-serach',
          path: '/tour-search',
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
          ],
        },
        {
          title: 'Tour Listing',
          icon: 'ti ti-package',
          active: false,
          permission: {
            module: 'tour_module',
            action: 'read',
          },
          submenu: [
            {
              title: 'All Tours',
              path: '/all-tours',
              active: false,
              permission: {
                module: 'tour_module',
                action: 'read',
              },
            },
            {
              title: 'Add tour',
              path: '/add-tour',
              active: false,
              permission: {
                module: 'tour_module',
                action: 'create',
              },
            },
            {
              title: 'Categories',
              path: '/tour-category',
              active: false,
              permission: {
                module: 'tour_module',
                action: 'read',
              },
            },
            {
              title: 'Locations',
              path: '/tour-location',
              active: false,
              permission: {
                module: 'tour_module',
                action: 'read',
              },
            },
            {
              title: 'Tags',
              path: '/tour-tags',
              active: false,
              permission: {
                module: 'tour_module',
                action: 'read',
              },
            },
          ],
        },
        {
          title: 'Settings',
          icon: 'ti ti-tool',
          active: false,
          permission: {
            module: 'settings_module',
            action: 'read',
          },
        },
        {
          title: 'Bookings',
          icon: 'ti ti-calendar',
          active: false,
          permission: {
            module: 'booking_module',
            action: 'read',
          },
          submenu: [
            {
              title: 'All Bookings',
              path: '/all-bookings',
              active: false,
              permission: {
                module: 'booking_module',
                action: 'read',
              },
            },
            {
              title: 'Add Booking',
              path: '/add-booking',
              active: false,
              permission: {
                module: 'booking_module',
                action: 'create',
              },
            },
          ],
        },
        {
          title: 'Users',
          icon: 'menu-icon tf-icons ti ti-users',
          active: false,
          permission: {
            module: 'manage_users',
            action: 'read',
          },
          submenu: [
            {
              title: 'All Users',
              path: '/users',
              active: false,
              permission: {
                module: 'manage_users',
                action: 'read',
              },
            },
            {
              title: 'Profile',
              path: `/users/profile/${userId}`,
              active: false,
              permission: {
                module: 'manage_users',
                action: 'read',
              },
            },
          ],
        },
        {
          title: 'Roles & Permissions',
          icon: 'menu-icon tf-icons ti ti-settings',
          active: false,
          permission: {
            module: 'roles_and_permissions',
            action: 'read',
          },
          submenu: [
            {
              title: 'Roles',
              path: '/roles',
              active: false,
              permission: {
                module: 'roles_and_permissions',
                action: 'read',
              },
            },
            {
              title: 'Permissions',
              path: '/permissions',
              active: false,
              permission: {
                module: 'roles_and_permissions',
                action: 'read',
              },
            },
          ],
        },
        {
          title: 'Notifications',
          icon: 'ti ti-bell',
          path: '/notifications',
          badge: '5',
          badgeClass: 'bg-danger',
          active: false,
          permission: {
            module: 'notification_modules',
            action: 'read',
          },
        },
      ],
    }
  },
  mounted() {},
  computed: {
    filteredMenuItems() {
      const filteredItems = this.menuItems.filter((item) => {
        const canAccess = this.uCan(item.permission.action, item.permission.module)
        return canAccess
      })
      return filteredItems
    },
  },
  methods: {
    // Method to toggle submenu
    menuToggle(event) {
      const menuItem = event.target.closest('.menu-item')
      if (menuItem) {
        menuItem.classList.toggle('open')
      }
    },

    // Method to filter submenu items
    filteredSubmenuItems(submenu) {
      const filteredSubItems = submenu.filter((subitem) => {
        const canAccess = this.uCan(subitem.permission.action, subitem.permission.module)
        return canAccess
      })
      return filteredSubItems
    },
  },
}
</script>

<template>
  <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <div class="app-brand demo">
      <TripgemLogo />
      <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
        <i class="ti menu-toggle-icon d-none d-xl-block align-middle"></i>
        <i class="ti ti-x d-block d-xl-none ti-md align-middle"></i>
      </a>
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1">
      <li
        v-for="(item, index) in filteredMenuItems"
        :key="index"
        class="menu-item"
        :class="{ 'active open': item.active }"
        @click="menuToggle"
      >
        <router-link v-if="!item.submenu" :to="item.path" class="menu-link">
          <i :class="`menu-icon tf-icons ${item.icon}`"></i>
          <div>{{ item.title }}</div>
          <div v-if="item.badge" :class="`badge ${item.badgeClass} rounded-pill ms-auto`">
            {{ item.badge }}
          </div>
        </router-link>
        <a v-else href="javascript:void(0);" class="menu-link menu-toggle">
          <i :class="`menu-icon tf-icons ${item.icon}`"></i>
          <div>{{ item.title }}</div>
          <div v-if="item.badge" :class="`badge ${item.badgeClass} rounded-pill ms-auto`">
            {{ item.badge }}
          </div>
        </a>
        <ul v-if="item.submenu" class="menu-sub">
          <li
            v-for="(subitem, subIndex) in filteredSubmenuItems(item.submenu)"
            :key="subIndex"
            class="menu-item"
            :class="{ active: subitem.active }"
          >
            <router-link :to="subitem.path" class="menu-link">
              <div>{{ subitem.title }}</div>
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

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
