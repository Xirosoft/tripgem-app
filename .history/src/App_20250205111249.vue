<script setup>
import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import SideBar from '@/components/Sidebar.vue'

import { useAuthStore } from '@/stores/auth'
import { computed, nextTick, onMounted, watch } from 'vue'
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

// Debugging to ensure the value of route.path and isAuthPage
// console.log('Initial route.path:', route.path)
// console.log('Initial isAuthPage:', isAuthPage.value)
// console.log('route.path === "/login":', route.path.trim().toLowerCase() === '/login')

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Function to handle route changes
const handleRouteChange = async () => {
  await nextTick() // Ensure DOM and route are fully updated
  // console.log('isAuthPage:', isAuthPage.value)
  // console.log('isLoggedIn:', isLoggedIn.value)

  if (isLoggedIn.value) {
    if (isAuthPage.value) {
      // console.log('User is logged in and is on an auth page')
      router.push({ name: 'AdminDashboard' })
      // console.log('route length', route.matched.length)
      // console.log('route track', route.path)
      // console.log('route Match', route.matched)
      // Stay on current route if it exists and is valid
      //   if (route.matched.length > 0) {
      //     console.log('Staying on current route:', route.name)
      //   } else {
      //     console.log('Invalid route, redirecting to AdminDashboard')
      // router.push({ name: 'AdminDashboard' })
      //   }
    }
  } else {
    console.log(isAuthPage.value)

    // router.push({ name: 'tripgemlogin' }) // Uncomment this when ready
  }
}

// Ensure route change handler is called on mount and on route updates.
onMounted(async () => {
  await nextTick() // Ensure DOM and route are fully updated
  // console.log('route.path after mount:', route.path)
  handleRouteChange()
})

watch(
  () => route.path,
  (newPath, oldPath) => {
    // console.log()
    // if (isAuthPage.value) {
    //   router.push({ name: 'AdminDashboard' })
    // }
    handleRouteChange()
    console.log(`Route changed from ${oldPath} to ${newPath}`)
    // handleRouteChange()
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
