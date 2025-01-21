<script>
import PermissionMixin from '@/stores/mixins/permissionMixin'
import { usePermissionsStore } from '@/stores/permissions'
import { RouterLink } from 'vue-router'

export default {
  name: 'TripgemLogo',
  components: {
    RouterLink,
  },
  mixins: [PermissionMixin],
  computed: {
    console.log('computer')

    canReadBrandLogo() {
      const permissionStore = usePermissionsStore()
      return this.uCan('read', 'brand_logo')
    },
  },
  watch: {
    console.log('watch')

    '$store.state.permissions': {
      handler() {
        this.canReadBrandLogo = this.uCan('read', 'brand_logo')
      },
      deep: true,
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
