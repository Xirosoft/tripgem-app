<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useViewMerchantsStore } from '../../stores/merchant/ViewMerchant.js'

const route = useRoute()
const ViewMerchant = useViewMerchantsStore()
const merchant = ViewMerchant.fetchMerchant(route.params.id)

console.log(route.params.id)
</script>

<template></template>
