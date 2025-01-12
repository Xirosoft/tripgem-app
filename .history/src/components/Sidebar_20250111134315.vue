<script>
export default {
  name: 'SideBar',

  data() {
    return {
      menuItems: [
        {
          title: 'Dashboard',
          icon: 'ti ti-home',
          path: '/dashboard',
          active: true,
        },
        {
          title: 'Merchant',
          icon: 'ti ti-calendar',
          active: false,
          submenu: [
            {
              title: 'All Bookings',
              path: '/bookings',
              active: false,
            },
            {
              title: 'New Booking',
              path: '/bookings/new',
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

  methods: {
    menuToggle() {
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
      <a href="index.html" class="app-brand-link">
        <!-- <img src="/logo.png" alt /> -->
        <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
        <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
      </a>

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
