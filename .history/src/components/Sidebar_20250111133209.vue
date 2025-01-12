<script>
export default {
  name: 'SideBar',

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
      <li class="menu-item active open">
        <a href="javascript:void(0);" class="menu-link menu-toggle">
          <i class="menu-icon tf-icons ti ti-smart-home"></i>
          <div data-i18n="Dashboards">Merchant</div>
          <div class="badge bg-danger rounded-pill ms-auto">5</div>
        </a>
        <ul class="menu-sub">
          <li class="menu-item active">
            <a href="index.html" class="menu-link">
              <div data-i18n="Analytics">Add Merchent</div>
            </a>
          </li>
          <li class="menu-item">
            <a href="dashboards-crm.html" class="menu-link">
              <div data-i18n="CRM">Views</div>
            </a>
          </li>
          <li class="menu-item">
            <a href="app-ecommerce-dashboard.html" class="menu-link">
              <div data-i18n="eCommerce">Merchant Requests</div>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<style lang="scss" scoped></style>
