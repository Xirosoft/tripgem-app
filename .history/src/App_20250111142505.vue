<script>
import { computed, onMounted } from 'vue'
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

const route = useRoute()
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('loginToken')
})

onMounted(() => {
  if (!isLoggedIn.value && !isAuthPage.value) {
    router.push({ name: 'tripgemlogin' })
  }
})
</script>

<template>
  <RouterView v-if="isAuthPage" />
  <template v-else>
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
        <div class="container-fluid flex-grow-1 container-p-y">
          <RouterView />
        </div>
        <!-- / Content -->

        <FooterSection />
        <!-- / Footer -->

        <div class="content-backdrop fade"></div>
      </div>
      <!-- Content wrapper -->
    </div>
  </template>
</template>

<style scoped></style>
