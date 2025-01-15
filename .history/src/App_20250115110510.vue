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
  return route.path === '/login' || route.path === '/register' || route.path === '/auth-two-steps'
})

const isLoggedIn = computed(() => authStore.isLoggedIn)
console.log(isLoggedIn)

const handleRouteChange = () => {
  console.log('Route changed')

  if (isLoggedIn.value) {
    if (isAuthPage.value) {
      router.push({ name: 'AdminDashboard' })
    }
  }
}

onMounted(() => {
  handleRouteChange()
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
