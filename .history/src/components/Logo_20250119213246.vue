<script>
import PermissionMixin from '@/stores/mixins/permissionMixin'
import { RouterLink } from 'vue-router'
import { usePermissionsStore } from '@/stores/permissions'

export default {
  name: 'TripgemLogo',
  components: {
    RouterLink,
  },
  mixins: [PermissionMixin],
  computed: {
    canReadBrandLogo() {
      const permissionStore = usePermissionsStore()
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
