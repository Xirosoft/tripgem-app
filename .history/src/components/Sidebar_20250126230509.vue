<script>
import TripgemLogo from './Logo.vue'
// import PermissionMixin from '@/stores/mixins/permissionMixin'

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
          active: false,
          permission: 'user_panel',
        },
        {
          title: 'Merchant',
          icon: 'ti ti-calendar',
          active: false,
          permission: 'merchant_module',
          submenu: [
            {
              title: 'All Merchants',
              path: '/merchants',
              active: false,
            },
            {
              title: 'Add Merchant',
              path: '/merchant/add',
              active: false,
              permission: 'add_merchant',
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
            },
            {
              title: 'Add user',
              path: '/user/add',
              active: false,
              // permission: 'add_user',
            },
            {
              title: 'Profile',
              path: '/users/edit/:userId',
              active: false,
              // permission: 'add_user',
            },
          ],
        },
        {
          title: 'Roles & Permissions',
          icon: 'menu-icon tf-icons ti ti-settings',
          active: false,
          permission: 'add_new_permission',
          submenu: [
            {
              title: 'Roles',
              path: '/roles',
              active: false,
            },
            {
              title: 'Permissions',
              path: '/permissions',
              active: false,
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
          permission: 'notification_modules',
        },
      ],
    }
  },
  mounted() {},
  computed: {
    filteredMenuItems() {
      return this.menuItems.filter((item) => this.uCan('read', item.permission))
    },
  },
  methods: {
    menuToggle(event) {
      const menuItem = event.target.closest('.menu-item')
      if (menuItem) {
        // menuItem.classList.toggle('active')
        menuItem.classList.toggle('open')
      }
    },
    filteredSubmenuItems(submenu) {
      return submenu.filter(
        (subitem) => !subitem.permission || this.uCan('create', subitem.permission),
      )
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
