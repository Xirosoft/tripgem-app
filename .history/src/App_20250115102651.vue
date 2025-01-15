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

console.log(authStore.isLoggedIn)

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
console.log(isAuthPage)

const isLoggedIn = computed(() => authStore.isLoggedIn)

onMounted(() => {
  if (!isLoggedIn.value && !isAuthPage.value) {
    router.push({ name: 'tripgemlogin' })
  } else if (isLoggedIn.value && isAuthPage.value) {
    router.push({ name: 'AdminDashboard' })
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
