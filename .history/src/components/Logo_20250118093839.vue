<script>
import { RouterLink } from 'vue-router'
import { usePermissionsStore } from '@/stores/permissions.js'
export default {
  name: 'TripgemLogo',
  components: {
    RouterLink,
  },
  methods: {
    const permissionsStore = usePermissionsStore()
  },
}
</script>

<template>
  <RouterLink to="/" class="app-brand-link">
    <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
    <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
  </RouterLink>
</template>

<style lang="scss"></style>
