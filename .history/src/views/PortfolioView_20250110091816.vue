<script setup>
import PortfolioItems from '../components/PortfolioItems.vue'
</script>

<template>
  <div class="about">
    <PortfolioItems />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
