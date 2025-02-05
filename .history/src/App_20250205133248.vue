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
const isAuthPage = computed(() => {
  // console.log(route.path.trim().toLowerCase())

  return authPaths.includes(route.path.trim().toLowerCase())
})

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Function to handle route changes
const handleRouteChange = async () => {
  const rootUrl = window.location.href
  console.log(rootUrl) // Outputs: "https://example.com"
  const currentPath = new URL(rootUrl).pathname
  console.log(authPaths.includes(currentPath.trim().toLowerCase()))
  console.log(!authPaths.includes(currentPath.trim().toLowerCase()))

  if (!authPaths.includes(currentPath.trim().toLowerCase())) {
    console.log('auth page')
  }

  if (isLoggedIn.value) {
    if (isAuthPage.value) {
      router.push({ name: 'AdminDashboard' })
    }
  } else {
    if (!authPaths.includes(currentPath.trim().toLowerCase())) {
      console.log('auth page')
      router.push({ name: 'tripgemlogin' })
    }
  }
}

// Ensure route change handler is called on route updates.
watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log('Route changed from', oldPath, 'to', newPath)
    handleRouteChange()
  },
)

// Initial route check
onMounted(() => {
  handleRouteChange()
})
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
