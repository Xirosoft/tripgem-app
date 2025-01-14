<script>
import { defineStore, useStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TripgemLogo from '@/components/Logo.vue'
import config from '../config/config'
import { useUserStore } from '@/stores/user' // Import the user store

// Define a store for user data
const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
  }),
  actions: {
    setEmail(email) {
      this.email = email
    },
  },
})

export default {
  name: 'TwoStepAuth',
  components: {
    TripgemLogo,
  },
  setup() {
    const router = useRouter()
    const otp = ref(['', '', '', '', '', ''])
    const userStore = useUserStore()

    const verifyOtp = async () => {
      const otpCode = otp.value.join('')
      try {
        const response = await axios.post(
          `${config.apiUrl}/verify-otp`,
          {
            email: userStore.email,
            otp: otpCode,
          },
          {
            headers: config.getHeaders(),
          },
        )
        if (response.data.success) {
          router.push('/dashboard')
        } else {
          alert('Invalid OTP')
        }
      } catch (error) {
        console.error('Error verifying OTP:', error)
        alert('Error verifying OTP')
      }
    }

    fetchUserEmail() // Fetch the email when the component is set up

    return {
      otp,
      verifyOtp,
    }
  },
}
</script>
<template>
  <div class="authentication-wrapper authentication-basic px-6">
    <div class="authentication-inner py-6">
      <!--  Two Steps Verification -->
      <div class="card">
        <div class="card-body">
          <!-- Logo -->
          <div class="app-brand justify-content-center mb-6">
            <TripgemLogo />
          </div>
          <!-- /Logo -->
          <h4 class="mb-1">Two Step Verification 💬</h4>
          <p class="text-start mb-6">
            We sent a verification code to your Email. Enter the code from the Email in the field
            below.
            <span class="fw-medium d-block mt-1 text-heading">******1234</span>
          </p>
          <div v-if="message" :class="`alert alert-${messageType} mb-3`" role="alert">
            {{ message }}
          </div>
          <p class="mb-0">Type your 6 digit security code</p>
          <form id="twoStepsForm" @submit.prevent="verifyOtp">
            <div class="mb-6">
              <div
                class="auth-input-wrapper d-flex align-items-center justify-content-between numeral-mask-wrapper"
              >
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[0]"
                  autofocus
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[1]"
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[2]"
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[3]"
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[4]"
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[5]"
                />
              </div>
              <!-- Create a hidden field which is combined by 3 fields above -->
              <input type="hidden" name="otp" />
            </div>
            <button class="btn btn-primary d-grid w-100 mb-6">Verify my account</button>
            <div class="text-center">
              Didn't get the code?
              <a href="javascript:void(0);"> Resend </a>
            </div>
          </form>
        </div>
      </div>
      <!-- / Two Steps Verification -->
    </div>
  </div>
</template>
<style></style>
