<script>
import { useStore } from 'pinia' // Change vuex to pinia
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

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

<template>
  <div>
    <h1>Add Booking</h1>
  </div>
</template>

<style></style>
