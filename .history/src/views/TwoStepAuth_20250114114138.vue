<script>
import { useUserStore } from '@/stores/TowStepUser' // Import the user store
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TripgemLogo from '@/components/Logo.vue'
import config from '../config/config'

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
          router.push('/')
        } else {
          alert('Invalid OTP')
        }
      } catch (error) {
        console.error('Error verifying OTP:', error)
        alert('Error verifying OTP')
      }
    }

    const handlePaste = (event) => {
      const paste = event.clipboardData.getData('text')
      if (paste.length === 6 && /^\d+$/.test(paste)) {
        for (let i = 0; i < 6; i++) {
          otp.value[i] = paste[i]
        }
      }
    }

    const handleInput = (index) => {
      return (event) => {
        const value = event.target.value;
        if (/^\d$/.test(value)) {
          otp.value[index] = value;
          if (index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
          }
        } else if (event.inputType === 'deleteContentBackward') {
          otp.value[index] = '';
          if (index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
          }
        } else {
          otp.value[index] = '';
        }
      }
    }

    const handleKeydown = (index) => {
      return (event) => {
        if (event.key === 'Backspace' && otp.value[index] === '') {
          if (index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
          }
        }
      }
    }

    return {
      otp,
      verifyOtp,
      handlePaste,
      handleInput,
      handleKeydown,
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
            below. test
            <span class="fw-medium d-block mt-1 text-heading">******1234</span>
          </p>
          <div v-if="message" :class="`alert alert-${messageType} mb-3`" role="alert">
            {{ message }}
          </div>
          <p class="mb-0">Type your 6 digit security code</p>
          <form id="twoStepsForm" @submit.prevent="verifyOtp" @paste="handlePaste">
            <div class="mb-6">
              <div
                class="auth-input-wrapper d-flex align-items-center justify-content-between numeral-mask-wrapper"
              >
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[0]"
                  @input="handleInput(0)"
                  @keydown="handleKeydown(0)"
                  id="otp-0"
                  autofocus
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[1]"
                  @input="handleInput(1)"
                  @keydown="handleKeydown(1)"
                  id="otp-1"
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[2]"
                  @input="handleInput(2)"
                  @keydown="handleKeydown(2)"
                  id="otp-2"
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[3]"
                  @input="handleInput(3)"
                  @keydown="handleKeydown(3)"
                  id="otp-3"
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[4]"
                  @input="handleInput(4)"
                  @keydown="handleKeydown(4)"
                  id="otp-4"
                />
                <input
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[5]"
                  @input="handleInput(5)"
                  @keydown="handleKeydown(5)"
                  id="otp-5"
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
