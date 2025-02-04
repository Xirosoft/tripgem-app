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
          ],
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
