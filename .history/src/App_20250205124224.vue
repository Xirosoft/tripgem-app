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

// Define authentication-related paths
const authPaths = ['/login', '/register', '/auth-two-steps', '/forget-password', '/reset-password']

// Computed property to check if the current route is an auth page
const isAuthPage = computed(() => authPaths.includes(route.path.trim().toLowerCase()))

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Function to handle route redirections
const handleRouteChange = () => {
  if (isLoggedIn.value && isAuthPage.value) {
    // If logged in and accessing an auth page, redirect to Admin Dashboard
    router.push({ name: 'AdminDashboard' })
  } else if (!isLoggedIn.value && !isAuthPage.value) {
    // If not logged in and accessing a non-auth page, redirect to login
    router.push({ name: 'tripgemlogin' })
  }
}

// Ensure correct route handling on component mount
onMounted(() => {
  handleRouteChange()
})

// Watch for route changes
watch(
  () => route.path,
  () => {
    handleRouteChange()
  },
)
</script>

<template>
  <RouterView v-if="isAuthPage" />
  <template v-else>
    <!-- Sidebar for logged-in users -->
    <SideBar v-if="isLoggedIn" />
    <div class="layout-page">
      <!-- Header for logged-in users -->
      <HeaderSection v-if="isLoggedIn" />

      <!-- Main content -->
      <div class="content-wrapper" v-if="isLoggedIn">
        <div class="container-fluid flex-grow-1 container-p-y">
          <RouterView />
        </div>
        <!-- Footer for logged-in users -->
        <FooterSection v-if="isLoggedIn" />
      </div>
    </div>
  </template>
</template>

<style scoped>
/* Add your styles here */
</style>
