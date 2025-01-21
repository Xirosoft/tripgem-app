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
    canReadBrandLogo() {
      console.log('Computed property canReadBrandLogo called')
      const permissionStore = usePermissionsStore()
      const result = this.uCan('read', 'brand_logo')
      // console.log('canReadBrandLogo result:', result)
      return result
    },
  },
  watch: {
    '$store.state.permissions': {
      handler() {
        // console.log('Permissions changed, updating canReadBrandLogo')
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
