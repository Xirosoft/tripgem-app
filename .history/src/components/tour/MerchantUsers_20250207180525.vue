<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2/dist/js/select2.full.min.js'
import { nextTick, onMounted, ref, watch } from 'vue'
import config from '../../config/config'

const merchants = ref([])
const users = ref([])
const selectedMerchant = ref(null)
const merchantSelectRef = ref(null)
const userSelectRef = ref(null)

const fetchMerchants = async () => {
  try {
    const response = await axios.get(`${config.apiUrl}/merchants/view/1`, {
      headers: config.getHeaders(),
    })
    merchants.value = response.data.data
    await nextTick()
    $(merchantSelectRef.value).select2()
  } catch (error) {
    console.error('Error fetching merchants:', error)
  }
}

const fetchUsersByMerchantId = async (merchantId) => {
  try {
    const response = await axios.get(
      `${config.apiUrl}/merchant/users/by-merchant-id/${merchantId}`,
      {
        headers: config.getHeaders(),
      },
    )
    users.value = response.data
    await nextTick()

    // Destroy and reinitialize select2 for Users
    $(userSelectRef.value).select2('destroy').empty().append(new Option('Select User', ''))
    users.value.forEach((user) => {
      $(userSelectRef.value).append(
        new Option(`${user.first_name} ${user.last_name}`, user.user_id),
      )
    })
    $(userSelectRef.value).select2()
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(async () => {
  await fetchMerchants()
})

watch(
  () => selectedMerchant.value,
  async (newMerchantId) => {
    if (newMerchantId) {
      await fetchUsersByMerchantId(newMerchantId)
    }
  },
)
</script>

<template>
  <div>
    <!-- Merchants -->
    <div class="mb-6 col ecommerce-select2-dropdown">
      <label class="form-label mb-1" for="Merchants">Merchants</label>
      <select
        id="Merchants"
        ref="merchantSelectRef"
        class="select2 form-select"
        data-placeholder="Select Merchants"
        v-model="selectedMerchant"
      >
        <option value="">Select Merchant</option>
        <option v-for="merchant in merchants" :key="merchant.id" :value="merchant.id">
          {{ merchant.company_name }}
        </option>
      </select>
    </div>
    <!-- Users -->
    <div class="mb-6 col ecommerce-select2-dropdown">
      <label class="form-label mb-1" for="Users">Users</label>
      <select
        id="Users"
        ref="userSelectRef"
        class="select2 form-select"
        data-placeholder="Select Users"
      >
        <option value="">Select User</option>
      </select>
    </div>
  </div>
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
