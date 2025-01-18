<script>
import { usePermissionsStore } from '@/stores/permissions.js'
import { RouterLink } from 'vue-router'
export default {
  name: 'TripgemLogo',
  components: {
    RouterLink,
  },
  computed: {
    canReadBrandLogo() {
      const permissionsStore = this.getPermissionsStore()
      const brandLogoPermission = permissionsStore.find(
        (permission) => permission.name === 'brand_logo',
      )
      return brandLogoPermission && brandLogoPermission.can_read === '1'
    },
  },
  methods: {
    getPermissionsStore() {
      const permissionsStore = usePermissionsStore()
      return permissionsStore
    },
  },
}
</script>

<template>
  <RouterLink v-if="canReadBrandLogo" to="/" class="app-brand-link">
    <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
    <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
  </RouterLink>
</template>

<style lang="scss"></style>
