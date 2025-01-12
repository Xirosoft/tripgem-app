<script setup>
import PortfolioItem from '../components/PortfolioItem.vue'
</script>

<template>
  <div class="about">
    <PortfolioItem
      title="Portfolio"
      description="This is a portfolio item."
      image="https://via.placeholder.com/150"
    />
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
