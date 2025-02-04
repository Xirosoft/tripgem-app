<script>
// import PermissionMixin from '@/stores/mixins/permissionMixin'
import { RouterLink } from 'vue-router'

export default {
  name: 'TripgemLogo',
  components: {
    RouterLink,
  },
  // mixins: [PermissionMixin],
  mounted() {
    console.log(this.uCan('read', 'user_dashboard'))
  },
  computed: {
    canReadBrandLogo() {
      const result = this.uCan('read', 'brand_logo')
      console.log('canReadBrandLogo', result)

      return result
    },
  },
  // watch: {
  //   '$store.state.permissions': {
  //     handler() {
  //       this.canReadBrandLogo = this.uCan('read', 'brand_logo')
  //     },
  //     deep: true,
  //   },
  // },
}
</script>

<template>
  <RouterLink to="/" class="app-brand-link" v-if="canReadBrandLogo">
    <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
    <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
  </RouterLink>
</template>

<style lang="scss"></style>
