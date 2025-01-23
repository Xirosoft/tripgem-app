<script setup>
import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import SideBar from '@/components/Sidebar.vue'

import { useAuthStore } from '@/stores/auth'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Define authentication-related paths
const authPaths = ['/login', '/register', '/auth-two-steps', '/forget-password', '/reset-password']

// Reactive state to avoid multiple executions
const hasHandledRouteChange = ref(false)

// Computed property to check if the current route is an auth page
const isAuthPage = computed(() => {
  return authPaths.includes(route.path.trim().toLowerCase())
})

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Function to handle route changes with stabilized execution
const handleRouteChange = async () => {
  if (hasHandledRouteChange.value) {
    console.log('Route change already handled, skipping...')
    return
  }

  hasHandledRouteChange.value = true // Mark route as handled
  console.log('Processing route change...')
  console.log('Route path:', route.path)
  console.log('isAuthPage:', isAuthPage.value)
  console.log('isLoggedIn:', isLoggedIn.value)

  if (isLoggedIn.value) {
    if (isAuthPage.value) {
      console.log('Redirecting to AdminDashboard...')
      await router.push({ name: 'AdminDashboard' })
    }
  } else if (!isAuthPage.value) {
    console.log('User is not logged in and is not on an auth page. Redirecting to login...')
    await router.push({ name: 'tripgemlogin' }) // Uncomment this when ready
  } else {
    console.log('User is not logged in and is on an auth page.')
  }

  // Allow handling of future route changes
  setTimeout(() => {
    hasHandledRouteChange.value = false
  }, 100) // Debounce for short intervals
}

// Ensure route change handler is called on mount and on route updates
onMounted(async () => {
  await nextTick() // Ensure DOM and route are fully updated
  console.log('Mounted. Handling initial route change...')
  await handleRouteChange()
})

watch(
  () => route.path,
  async (newPath, oldPath) => {
    console.log(`Route changed from ${oldPath} to ${newPath}`)
    await handleRouteChange()
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
