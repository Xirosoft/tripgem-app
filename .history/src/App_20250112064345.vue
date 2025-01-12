<!-- filepath: /Applications/XAMPP/xamppfiles/htdocs/tripgem/src/App.vue -->
<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SideBar from '@/components/Sidebar.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import FooterSection from '@/components/FooterSection.vue'

const route = useRoute()
const router = useRouter()

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('loginToken')
})

onMounted(() => {
  if (!isLoggedIn.value && !isAuthPage.value) {
    router.push({ name: 'tripgemlogin' })
  } else if (isLoggedIn.value && isAuthPage.value) {
    router.push({ name: 'AdminDashboard' })
  }
})
</script>

<template>
  <RouterView v-if="isAuthPage" />
  <template v-else>
    <!-- Menu -->
    <SideBar v-if="isLoggedIn" />
    <!-- / Menu -->
    <!-- Layout container -->
    <div class="layout-page">
      <!-- Navbar -->
      <HeaderSection v-if="isLoggedIn" />
      <!-- / Navbar -->

      <!-- Content wrapper -->
      <div class="content-wrapper">
        <!-- Content -->
        <div class="container-fluid flex-grow-1 container-p-y">
          <RouterView />
        </div>
        <FooterSection v-if="isLoggedIn" />
      </div>
    </div>
    <!-- Footer -->

    <!-- / Footer -->
  </template>
</template>

<style scoped>
/* Add your styles here */
</style>
