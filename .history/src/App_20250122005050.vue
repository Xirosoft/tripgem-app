<script setup>
import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import SideBar from '@/components/Sidebar.vue'
import { usePermissionsStore } from './stores/permissions' // Import usePermissionsStore
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path === '/auth-two-steps'
})

const isLoggedIn = computed(() => authStore.isLoggedIn)

const handleRouteChange = async () => {
  console.log('Route changed')
  // console.log('isAuthPage:', isAuthPage.value)

  if (isLoggedIn.value) {
    if (isAuthPage.value) {
      const permissionStore = usePermissionsStore()
      await permissionStore.fetchPermissions()
      // Initialize permissions once
      router.push({ name: 'AdminDashboard' }).then(() => {
        location.reload()
      })
    }
  } else if (isAuthPage.value === false) {
    console.log('Redirecting to login page')
    const permissionStore = usePermissionsStore()
    permissionStore.$reset() // Clear permissions store on logout
    router.push({ name: 'tripgemlogin' })
  }
}

onMounted(() => {
  // handleRouteChange()
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
