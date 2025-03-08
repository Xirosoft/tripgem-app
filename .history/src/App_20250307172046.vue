<script setup>
import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import SideBar from '@/components/Sidebar.vue'
import $ from 'jquery' // Import jQuery

import { useAuthStore } from '@/stores/auth'
import 'bootstrap/dist/css/bootstrap.min.css' // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Import Bootstrap JS
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Define authentication-related paths
const authPaths = ['/login', '/register', '/auth-two-steps', '/forget-password', '/reset-password']

// Computed property to check if the current route is an auth page
const isAuthPage = computed(() => {
  return authPaths.includes(route.path.trim().toLowerCase())
})

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Function to handle route changes
const handleRouteChange = async () => {
  const rootUrl = window.location.href
  const currentPath = new URL(rootUrl).pathname
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
  // Example usage of jQuery
  $(document).ready(function () {
    console.log('jQuery is ready!')
  })
})
</script>

<template>
  <h1>App</h1>
</template>

<style scoped>
/* Add your styles here */
</style>
