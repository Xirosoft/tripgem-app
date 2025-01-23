<script setup>
import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import SideBar from '@/components/Sidebar.vue'

import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAuthPage = computed(() => {
  return (
    route.path === '/login' ||
    route.path === '/register' ||
    route.path === '/auth-two-steps' ||
    route.path === '/forget-password' ||
    route.path === '/reset-password'
  )
})

const isLoggedIn = computed(() => authStore.isLoggedIn)

const handleRouteChange = () => {
  // console.log('Route changed')
  // console.log('isAuthPage:', isAuthPage.value)

  if (isLoggedIn.value) {
    if (isAuthPage.value) {
      router.push({ name: 'AdminDashboard' })
    }
  } else if (
    isAuthPage.value === false &&
    route.path !== '/login' &&
    route.path !== '/register' &&
    route.path !== '/forget-password' &&
    route.path !== '/reset-password'
  ) {
    console.log('Redirecting to login page')
  } else {
    router.push({ name: 'tripgemlogin' })
  }
}

onMounted(() => {
  handleRouteChange() // Ensure route change handler is called on mount
})

watch(route, () => {
  handleRouteChange()
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
      <div class="content-wrapper" v-if="isLoggedIn">
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
