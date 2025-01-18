<script>
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
        },
        {
          title: 'Merchant',
          icon: 'ti ti-calendar',
          active: false,
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
            },
          ],
        },

        {
          title: 'Users',
          icon: 'menu-icon tf-icons ti ti-users',
          active: false,
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
            },
          ],
        },
        {
          title: 'Roles & Permissions',
          icon: 'menu-icon tf-icons ti ti-settings',
          active: false,
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
        },
      ],
    }
  },
  mounted() {
    // const permissionsStore = usePermissionsStore()
    // permissionsStore.fetchPermissions()
    // console.log('permissions', permissionsStore.permissions)
    // console.log(uCan('read | write | create', 'manage_users'))
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
        v-for="(item, index) in menuItems"
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
            v-for="(subitem, subIndex) in item.submenu"
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
