<script setup>
import TripgemLogo from '@/components/Logo.vue'
import config from '@/config'
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const password = ref('')
const confirmPassword = ref('')
const token = route.query.token
const message = ref('')
const messageType = ref('')

const resetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match'
    messageType.value = 'danger'
    return
  }

  try {
    const response = await axios.post(`${config.apiUrl}/reset-password`, {
      token: token,
      old_password: '', // Assuming old_password is not required
      password: password.value,
    })
    message.value = response.data.message
    messageType.value = response.data.status === 'success' ? 'success' : 'danger'
  } catch (error) {
    message.value = error.response?.data?.message || 'Error resetting password'
    messageType.value = 'danger'
  }
}
</script>

<template>
  <div class="authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner py-6">
      <!-- Reset Password -->
      <div class="card">
        <div class="card-body">
          <!-- Logo -->
          <div class="app-brand justify-content-center mb-6">
            <TripgemLogo />
          </div>
          <!-- /Logo -->
          <h4 class="mb-1">Reset Password 🔒</h4>
          <p class="mb-6">
            <span class="fw-medium"
              >Your new password must be different from previously used passwords</span
            >
          </p>
          <!-- Error/Success Message -->
          <div v-if="message" :class="`alert alert-${messageType} mb-3`" role="alert">
            {{ message }}
          </div>
          <form id="formAuthentication" @submit.prevent="resetPassword">
            <div class="mb-6 form-password-toggle">
              <label class="form-label" for="password">New Password</label>
              <div class="input-group input-group-merge">
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  name="password"
                  v-model="password"
                  placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                  aria-describedby="password"
                />
                <span class="input-group-text cursor-pointer"><i class="ti ti-eye-off"></i></span>
              </div>
            </div>
            <div class="mb-6 form-password-toggle">
              <label class="form-label" for="confirm-password">Confirm Password</label>
              <div class="input-group input-group-merge">
                <input
                  type="password"
                  id="confirm-password"
                  class="form-control"
                  name="confirm-password"
                  v-model="confirmPassword"
                  placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                  aria-describedby="password"
                />
                <span class="input-group-text cursor-pointer"><i class="ti ti-eye-off"></i></span>
              </div>
            </div>
            <button class="btn btn-primary d-grid w-100 mb-6">Set new password</button>
            <div class="text-center">
              <RouterLink to="/login">
                <i class="ti ti-chevron-left scaleX-n1-rtl me-1_5"></i>
                <span>Back to login</span>
              </RouterLink>
            </div>
          </form>
        </div>
      </div>
      <!-- /Reset Password -->
    </div>
  </div>
</template>

<style lang="less" scoped></style>
