<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import config from '../../config/config'

const merchants = ref([])
const users = ref([])
const selectedMerchant = ref(null)
const merchantSelectRef = ref(null)
const userSelectRef = ref(null)

const loadingMerchants = ref(false)
const loadingUsers = ref(false)

const fetchMerchants = async () => {
  loadingMerchants.value = true
  try {
    const response = await axios.get(`${config.apiUrl}/merchants/view/1`, {
      headers: config.getHeaders(),
    })
    merchants.value = response.data.data
  } catch (error) {
    console.error('Error fetching merchants:', error)
  } finally {
    loadingMerchants.value = false
  }
}

const fetchUsersByMerchantId = async (merchantId) => {
  loadingUsers.value = true
  try {
    const response = await axios.get(
      `${config.apiUrl}/merchant/users/by-merchant-id/${merchantId}`,
      {
        headers: config.getHeaders(),
      },
    )
    users.value = response.data // Adjusted to match the structure of the response
    console.log('users:', response.data)
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loadingUsers.value = false
  }
}

onMounted(async () => {
  await fetchMerchants()
  nextTick(() => {
    $(merchantSelectRef.value)
      .select2()
      .on('change', function () {
        selectedMerchant.value = $(this).val()
      })
    $(userSelectRef.value).select2()
  })
})

watch(
  () => selectedMerchant.value,
  async (newMerchantId) => {
    console.log('newMerchantId:', newMerchantId)

    if (newMerchantId) {
      await fetchUsersByMerchantId(newMerchantId)
    }
    nextTick(() => {
      $(userSelectRef.value).select2('destroy').select2()
    })
  },
)
</script>

<template>
   <!-- Collection -->
   <div class="mb-6 col ecommerce-select2-dropdown">
        <label class="form-label mb-1" for="collection">Location </label>
        <select id="collection" class="select2 form-select" data-placeholder="Collection">
          <option value="">Collection</option>
          <option value="men-clothing">Men's Clothing</option>
          <option value="women-clothing">Women's-clothing</option>
          <option value="kid-clothing">Kid's-clothing</option>
        </select>
      </div>
      <!-- Status -->
</template>

<style>
@import 'select2/dist/css/select2.css';

body .select2-container .select2-selection--single {
  height: auto;
}
body .select2-container--default .select2-selection--single .select2-selection__arrow {
  height: 36px;
  right: 7px;
}
</style>
