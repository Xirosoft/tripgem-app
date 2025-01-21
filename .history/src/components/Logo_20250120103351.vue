<script>
import PermissionMixin from '@/stores/mixins/permissionMixin'
import { usePermissionsStore } from '@/stores/permissions'
import { useAuthStore } from '@/stores/auth' // Import useAuthStore
import { RouterLink } from 'vue-router'

export default {
  name: 'TripgemLogo',
  components: {
    RouterLink,
  },
  mixins: [PermissionMixin],
  computed: {
    canReadBrandLogo() {
      const permissionStore = usePermissionsStore()
      const userId = useAuthStore().userId
      return this.uCan('read', 'brand_logo')
    },
  },
}
</script>

<template>
  <RouterLink to="/" class="app-brand-link" v-if="canReadBrandLogo">
    <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
    <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
  </RouterLink>
</template>

<style lang="scss"></style>
