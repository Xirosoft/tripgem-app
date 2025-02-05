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
    // console.log('User Dashboard', this.uCan('read', 'user_dashboard'))
  },
  computed: {
    vCan() {
      const result = this.uCan('read', 'brand_logo')
      console.log('vCan', result)
      return result
    },
  },
}
</script>

<template>
  <RouterLink to="/" class="app-brand-link" v-if="this.uCan('read', 'brand_logo')">
    <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
    <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
  </RouterLink>
</template>

<style lang="scss"></style>
