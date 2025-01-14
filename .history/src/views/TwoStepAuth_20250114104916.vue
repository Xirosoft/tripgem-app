<script>
import { useUserStore } from '@/stores/TowStepUser'; // Import the user store
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TripgemLogo from '@/components/Logo.vue';
import config from '../config/config';

export default {
  name: 'TwoStepAuth',
  components: {
    TripgemLogo,
  },
  setup() {
    const router = useRouter();
    const otp = ref(['', '', '', '', '', '']);
    const userStore = useUserStore();

    const verifyOtp = async () => {
      const otpCode = otp.value.join('');
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
        );
        if (response.data.success) {
          router.push('/');
        } else {
          alert('Invalid OTP');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        alert('Error verifying OTP');
      }
    };

    const handlePaste = (event) => {
      const paste = event.clipboardData.getData('text');
      if (paste.length === 6 && /^\d+$/.test(paste)) {
        otp.value = paste.split('');
        // Focus on the last field
        document.getElementById('otp-5').focus();
      }
    };

    const handleInput = (index) => (event) => {
      const value = event.target.value;

      if (/^\d$/.test(value)) {
        otp.value[index] = value;

        // Move to the next input if it's not the last
        if (index < 5) {
          document.getElementById(`otp-${index + 1}`).focus();
        }
      } else {
        // Clear invalid input
        otp.value[index] = '';
      }
    };

    const handleBackspace = (index) => (event) => {
      if (event.key === 'Backspace' && otp.value[index] === '') {
        // Move focus to the previous input if it's not the first
        if (index > 0) {
          document.getElementById(`otp-${index - 1}`).focus();
        }
      }
    };

    return {
      otp,
      verifyOtp,
      handlePaste,
      handleInput,
      handleBackspace,
    };
  },
};
</script>

<template>
  <div class="authentication-wrapper authentication-basic px-6">
    <div class="authentication-inner py-6">
      <div class="card">
        <div class="card-body">
          <div class="app-brand justify-content-center mb-6">
            <TripgemLogo />
          </div>
          <h4 class="mb-1">Two Step Verification 💬</h4>
          <p class="text-start mb-6">
            We sent a verification code to your Email. Enter the code from the Email in the field
            below.
            <span class="fw-medium d-block mt-1 text-heading">******1234</span>
          </p>
          <p class="mb-0">Type your 6 digit security code</p>
          <form id="twoStepsForm" @submit.prevent="verifyOtp" @paste="handlePaste">
            <div class="mb-6">
              <div
                class="auth-input-wrapper d-flex align-items-center justify-content-between numeral-mask-wrapper"
              >
                <input
                  v-for="(value, index) in otp"
                  :key="index"
                  :id="`otp-${index}`"
                  type="tel"
                  class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                  maxlength="1"
                  v-model="otp[index]"
                  @input="handleInput(index)"
                  @keydown="handleBackspace(index)"
                  :autofocus="index === 0"
                />
              </div>
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
    </div>
  </div>
</template>

<style></style>
