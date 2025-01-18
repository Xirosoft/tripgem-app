<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'TripgemLogo',
  components: {
    RouterLink,
  },
  methods: {
    console.log(uCan('read | write | create', 'brand_logo'));

  },

}
</script>

<template>
  <RouterLink to="/" class="app-brand-link" v-if="uCan('read | write | create', 'brand_logo')">
    <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
    <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
  </RouterLink>
</template>

<style lang="scss"></style>
