<script setup>
import Portfolio from '../components/Portfolio.vue'
</script>

<template>
  <div class="about">
    <Portfolio />
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
