<script>
import HeaderSection from '@/components/HeaderSection.vue'
import SideBar from '@/components/Sidebar.vue'
import FooterSection from './components/FooterSection.vue'
import { RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'

export default {
  components: {
    SideBar,
    HeaderSection,
    FooterSection,
  },
}
</script>
<script setup></script>

<!-- <template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/portfolio">Portfolio</RouterLink>
      </nav>
    </div>
  </header>
</template> -->

<template>
  <RouterView />
  <!-- Menu -->
  <SideBar />
  <!-- / Menu -->
  <!-- Layout container -->
  <div class="layout-page">
    <!-- Navbar -->
    <HeaderSection />
    <!-- / Navbar -->

    <!-- Content wrapper -->
    <div class="content-wrapper">
      <!-- Content -->

      <div class="container-fluid flex-grow-1 container-p-y"></div>
      <!-- / Content -->

      <FooterSection />
      <!-- / Footer -->

      <div class="content-backdrop fade"></div>
    </div>
    <!-- Content wrapper -->
  </div>
</template>

<style scoped></style>
