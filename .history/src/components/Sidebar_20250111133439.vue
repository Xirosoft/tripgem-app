<script>
export default {
  name: 'SideBar',

    title: "Dashboard",
    icon: "ti ti-home",
    path: "/dashboard",
    active: true
  },
  {
    title: "Users",
    icon: "ti ti-users",
    path: "/users",
    submenu: [
      {
        title: "List",
        path: "/users/list"
      },
      {
        title: "Add User",
        path: "/users/add"
      }
    ]
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
  </aside>
</template>

<style lang="scss" scoped></style>
