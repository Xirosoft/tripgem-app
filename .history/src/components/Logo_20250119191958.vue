<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'TripgemLogo',
  components: {
    RouterLink,
  },
  methods: {},
}
</script>

<template>
  <RouterLink to="/" class="app-brand-link">
    <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
    <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
  </RouterLink>
  <!-- <RouterLink to="/" class="app-brand-link" v-if="uCan('read', 'brand_logo')">
    <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
    <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
  </RouterLink> -->
</template>

<style lang="scss"></style>
