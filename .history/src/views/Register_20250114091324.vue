<script setup>
import { ref } from 'vue'
import axios from 'axios'
import TripgemLogo from '@/components/Logo.vue'

const first_name = ref('')
const last_name = ref('')
const email = ref('')
const phone_number = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('')

const handleRegister = async () => {
  try {
    const response = await axios.post('/register', {
      email: email.value,
      phone_number: phone_number.value,
      password: password.value,
      first_name: first_name.value,
      last_name: last_name.value,
      role_id: 20,
      { headers: config.getHeaders() },
    })
    if (response.data.status === 'success') {
      message.value = response.data.message
      messageType.value = 'danger'
      return
    } else {
      message.value = response.data.message
      messageType.value = 'success'
    }
  } catch (error) {
    message.value = `Registration failed: ${error.message}`
    messageType.value = 'danger'
  }
}
</script>

<template>
  <div class="authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner py-6">
      <!-- Register Card -->
      <div class="card">
        <div class="card-body">
          <!-- Logo -->
          <div class="app-brand justify-content-center mb-6">
            <TripgemLogo />
          </div>
          <!-- /Logo -->
          <h4 class="mb-1">Adventure starts here 🚀</h4>
          <p class="mb-6">Make your app management easy and fun!</p>
          <!-- Error/Success Message -->
          <div v-if="message" :class="`alert alert-${messageType} mb-3`" role="alert">
            {{ message }}
          </div>
          <form id="formAuthentication" class="mb-6" @submit.prevent="handleRegister">
            <div class="mb-6">
              <label for="first-name" class="form-label">First Name</label>
              <input
                type="text"
                class="form-control"
                id="first-name"
                v-model="first_name"
                placeholder="Enter your first-name"
                autofocus
              />
            </div>
            <div class="mb-6">
              <label for="last-name" class="form-label">Last Name</label>
              <input
                type="text"
                class="form-control"
                id="last-name"
                v-model="last_name"
                placeholder="Enter your last-name"
                autofocus
              />
            </div>
            <div class="mb-6">
              <label for="email" class="form-label">Email</label>
              <input
                type="text"
                class="form-control"
                id="email"
                v-model="email"
                placeholder="Enter your email"
              />
            </div>
            <div class="mb-6 form-password-toggle">
              <label class="form-label" for="password">Password</label>
              <div class="input-group input-group-merge">
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  v-model="password"
                  placeholder="Enter Password"
                  aria-describedby="password"
                />
                <span class="input-group-text cursor-pointer"><i class="ti ti-eye-off"></i></span>
              </div>
            </div>

            <div class="my-8">
              <div class="form-check mb-0 ms-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="terms-conditions"
                  name="terms"
                />
                <label class="form-check-label" for="terms-conditions">
                  I agree to
                  <a href="javascript:void(0);">privacy policy & terms</a>
                </label>
              </div>
            </div>
            <button class="btn btn-primary d-grid w-100">Sign up</button>
          </form>

          <p class="text-center">
            <span>Already have an account?</span>
            <RouterLink to="/login">
              <span>Sign in</span>
            </RouterLink>
          </p>
        </div>
      </div>
      <!-- Register Card -->
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
