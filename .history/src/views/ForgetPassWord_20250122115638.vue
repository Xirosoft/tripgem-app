<script>
import TripgemLogo from '@/components/Logo.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

export default {
  name: 'ForgetPassWord',
  components: {
    TripgemLogo,
  },
}
</script>

<template>
  <div class="authentication-wrapper authentication-basic container-p-y">
    <div class="authentication-inner py-6">
      <!-- Forgot Password -->
      <div class="card">
        <div class="card-body">
          <!-- Logo -->
          <div class="app-brand justify-content-center mb-6">
            <TripgemLogo />
          </div>
          <!-- /Logo -->
          <h4 class="mb-1">Forgot Password? 🔒</h4>
          <p class="mb-6">
            Enter your email and we'll send you instructions to reset your password
          </p>
          <form
            id="formAuthentication"
            class="mb-6"
            action="auth-reset-password-basic.html"
            method="GET"
          >
            <div class="mb-6">
              <label for="email" class="form-label">Email</label>
              <input
                type="text"
                class="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                autofocus
              />
            </div>
            <button class="btn btn-primary d-grid w-100">Send Reset Link</button>
          </form>
          <div class="text-center">
            <a href="auth-login-basic.html" class="d-flex justify-content-center">
              <i class="ti ti-chevron-left scaleX-n1-rtl me-1_5"></i>
              Back to login
            </a>
          </div>
        </div>
      </div>
      <!-- /Forgot Password -->
    </div>
  </div>
</template>

<style scoped></style>
