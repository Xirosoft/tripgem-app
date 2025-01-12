<script setup>
import Portfolio from '../components/PortfolioSection.vue'
</script>

<template>
  <div class="about">
    <PortfolioSection />
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
