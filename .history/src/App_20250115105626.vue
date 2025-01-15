<script setup>
import FooterSection from '@/components/FooterSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import SideBar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path === '/auth-two-steps'
})
console.log(isAuthPage)

const isLoggedIn = computed(() => authStore.isLoggedIn)

onMounted(() => {
  if (isLoggedIn.value) {
    console.log('Logged in 1')

    if (isAuthPage.value) {
      console.log('Logged in 2')

      router.push({ name: 'AdminDashboard' })
    }
  } else if (
    route.path !== '/login' ||
    route.path !== '/register' ||
    route.path !== '/auth-two-steps'
  ) {
    // router.push({ name: 'tripgemlogin' })
    console.log('Not logged in')
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
