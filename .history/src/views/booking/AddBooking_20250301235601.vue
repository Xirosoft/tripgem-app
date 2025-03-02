<script>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'AddBooking',
  setup() {
    const store = useStore()
    const router = useRouter()

    const props = defineProps()

    return {
      store,
      router,
      props,
    }
  },
}
</script>

<template>Booking</template>

<style</style>
