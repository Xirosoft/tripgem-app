<script setup>
const props = defineProps({
  selectedMerchantId: String,
  selectedUserId: String,
})
const emit = defineEmits(['merchant-user-change'])
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import config from '../../../config/config'

const merchants = ref([])
const users = ref([])
const selectedMerchant = ref(null)
const selectedUser = ref(null)
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
    // console.log('users:', response.data)
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loadingUsers.value = false
  }
}

const emitMerchantUserChange = () => {
  emit('merchant-user-change', selectedMerchant.value, selectedUser.value)
}

onMounted(async () => {
  await fetchMerchants()
  nextTick(() => {
    $(merchantSelectRef.value)
      .select2()
      .on('change', function () {
        selectedMerchant.value = $(this).val()
      })
    $(userSelectRef.value)
      .select2()
      .on('change', function () {
        selectedUser.value = $(this).val()
      })
    // Trigger change to set initial values
    $(merchantSelectRef.value).val(props.selectedMerchantId).trigger('change')
    $(userSelectRef.value).val(props.selectedUserId).trigger('change')
  })
})

watch(
  () => selectedMerchant.value,
  async (newMerchantId) => {
    console.log('Merchant changed:', newMerchantId)
    if (newMerchantId) {
      await fetchUsersByMerchantId(newMerchantId)
      nextTick(() => {
        setTimeout(() => {
          console.log('Setting user select value to:', props.selectedUserId)
          $(userSelectRef.value).val(props.selectedUserId).trigger('change')
        }, 100) // Add a delay to ensure the user list is fully populated
      })
    } else {
      users.value = []
      nextTick(() => {
        $(userSelectRef.value).val(null).trigger('change')
      })
    }
    nextTick(() => {
      if ($(userSelectRef.value).hasClass('select2-hidden-accessible')) {
        $(userSelectRef.value).select2('destroy').select2()
      }
    })
    emitMerchantUserChange()
  },
)

watch(
  () => selectedUser.value,
  (newUserId) => {
    console.log('User changed:', newUserId)
    emitMerchantUserChange()
  },
)

// Watch for prop changes to set initial values
watch(
  () => props.selectedMerchantId,
  async (newVal) => {
    console.log('Prop selectedMerchantId changed:', newVal)
    selectedMerchant.value = newVal
    if (newVal) {
      await fetchUsersByMerchantId(newVal)
      nextTick(() => {
        $(merchantSelectRef.value).val(newVal).trigger('change')
        setTimeout(() => {
          console.log('Setting user select value to:', props.selectedUserId)
          $(userSelectRef.value).val(props.selectedUserId).trigger('change')
        }, 100)
      })
    }
  },
  { immediate: true },
)

watch(
  () => props.selectedUserId,
  (newVal) => {
    console.log('Prop selectedUserId changed:', newVal)
    selectedUser.value = newVal
    nextTick(() => {
      setTimeout(() => {
        console.log('Setting user select value to:', newVal)
        $(userSelectRef.value).val(newVal).trigger('change')
      }, 10000)
    })
  },
  { immediate: true },
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
        class="form-select"
        data-placeholder="Select Merchants"
        v-model="selectedMerchant"
        :disabled="loadingMerchants"
      >
        <option value="">Select Merchant</option>
        <option v-for="merchant in merchants" :key="merchant.id" :value="merchant.id">
          {{ merchant.company_name }}
        </option>
      </select>
      <div v-if="loadingMerchants">Loading merchants...</div>
    </div>
    <!-- Users -->
    <div class="mb-6 col ecommerce-select2-dropdown">
      <label class="form-label mb-1" for="Users">Users</label>
      <select
        id="Users"
        ref="userSelectRef"
        class="form-select"
        data-placeholder="Select Users"
        v-model="selectedUser"
        :disabled="loadingUsers"
      >
        <option value="">Select User</option>
        <option v-for="user in users" :key="user.user_id" :value="user.user_id">
          {{ user.first_name }} {{ user.last_name }}
        </option>
      </select>
      <div v-if="loadingUsers">Loading users...</div>
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
