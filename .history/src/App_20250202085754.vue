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
const isAuthPage = computed(() => authPaths.includes(route.path.trim().toLowerCase()))

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

// Save the last visited route before leaving
const saveLastVisitedRoute = () => {
  if (isLoggedIn.value && !isAuthPage.value) {
    localStorage.setItem('lastVisitedRoute', route.fullPath)
  }
}

// Restore the last visited route on refresh
const restoreLastVisitedRoute = async () => {
  const lastRoute = localStorage.getItem('lastVisitedRoute')

  if (isLoggedIn.value && lastRoute && lastRoute !== route.fullPath) {
    await nextTick()
    router.replace(lastRoute) // Use replace() to avoid unnecessary history entry
  }
}

// Handle route changes and authentication
const handleRouteChange = async () => {
  await nextTick()

  console.log('isAuthPage:', isAuthPage.value)
  console.log('isLoggedIn:', isLoggedIn.value)

  if (isLoggedIn.value) {
    if (!isAuthPage.value) {
      saveLastVisitedRoute()
    }
  } else if (!isAuthPage.value) {
    console.log('User is not logged in and is not on an auth page, redirecting to login...')
    router.push({ name: 'tripgemlogin' })
  }
}

// Call restoreLastVisitedRoute on mount
onMounted(async () => {
  await nextTick()
  restoreLastVisitedRoute()
  handleRouteChange()
})

// Watch for route changes
watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log(`Route changed from ${oldPath} to ${newPath}`)
    handleRouteChange()
  },
)

// Watch for authentication state changes
watch(
  () => isLoggedIn.value,
  (newStatus) => {
    if (newStatus) {
      restoreLastVisitedRoute()
    }
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
