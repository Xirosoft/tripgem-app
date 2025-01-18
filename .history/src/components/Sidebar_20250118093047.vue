<script>
import { usePermissionsStore } from '@/stores/permissions.js'
import TripgemLogo from './Logo.vue'

export default {
  name: 'SideBar',
  components: {
    TripgemLogo,
  },

  data() {
    return {
      menuItems: [
        {
          title: 'Dashboard',
          icon: 'ti ti-home',
          path: '/',
          active: true,
          permission: 'view_dashboard',
        },
        {
          title: 'Merchant',
          icon: 'ti ti-calendar',
          active: false,
          permission: 'manage_merchants',
          submenu: [
            {
              title: 'All Merchants',
              path: '/merchants',
              active: false,
              permission: 'view_merchants',
            },
            {
              title: 'Add Merchant',
              path: '/merchant/add',
              active: false,
              permission: 'add_merchants',
            },
          ],
        },
        {
          title: 'Users',
          icon: 'menu-icon tf-icons ti ti-users',
          active: false,
          permission: 'manage_users',
          submenu: [
            {
              title: 'All Users',
              path: '/users',
              active: false,
              permission: 'view_users',
            },
            {
              title: 'Add user',
              path: '/user/add',
              active: false,
              permission: 'add_users',
            },
          ],
        },
        {
          title: 'Roles & Permissions',
          icon: 'menu-icon tf-icons ti ti-settings',
          active: false,
          permission: 'manage_roles_permissions',
          submenu: [
            {
              title: 'Roles',
              path: '/roles',
              active: false,
              permission: 'view_roles',
            },
            {
              title: 'Permissions',
              path: '/permissions',
              active: false,
              permission: 'view_permissions',
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
          permission: 'view_notifications',
        },
      ],
    }
  },
  computed: {
    filteredMenuItems() {
      const permissionsStore = usePermissionsStore()
      return this.menuItems.filter((item) => {
        const permission = permissionsStore.getPermission(item.permission)
        return permission.can_read === '1'
      })
    },
    getFilteredSubmenu() {
      return (submenuItems) => {
        const permissionsStore = usePermissionsStore()
        return submenuItems.filter((item) => {
          const permission = permissionsStore.getPermission(item.permission)
          return permission.can_read === '1'
        })
      }
    },
  },
  mounted() {
    const permissionsStore = usePermissionsStore()
    permissionsStore.fetchPermissions()
  },
  methods: {
    menuToggle(event) {
      const menuItem = event.target.closest('.menu-item')
      if (menuItem) {
        menuItem.classList.toggle('active')
        menuItem.classList.toggle('open')
      }
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
        <ul v-if="item.submenu" class="menu-sub">
          <li
            v-for="(subitem, subIndex) in getFilteredSubmenu(item.submenu)"
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

<style lang="scss" scoped></style>
