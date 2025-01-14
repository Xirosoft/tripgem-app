<script setup>
// import { ref, computed } from 'vue'
import { TripgemLogo } from 'TripgemLogo.vue'

const handleRegister = async () => {
  console.log('Registering...')
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

          <form id="formAuthentication" class="mb-6" @submit.prevent="handleRegister">
            <div class="mb-6">
              <label for="first-name" class="form-label">First Name</label>
              <input
                type="text"
                class="form-control"
                id="first-name"
                name="first-name"
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
                name="last-name"
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
                name="email"
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
                  name="password"
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
              <span>Create an account</span>
            </RouterLink>
          </p>

          <div class="divider my-6">
            <div class="divider-text">or</div>
          </div>

          <div class="d-flex justify-content-center">
            <a
              href="javascript:;"
              class="btn btn-sm btn-icon rounded-pill btn-text-facebook me-1_5"
            >
              <i class="tf-icons ti ti-brand-facebook-filled"></i>
            </a>

            <a href="javascript:;" class="btn btn-sm btn-icon rounded-pill btn-text-twitter me-1_5">
              <i class="tf-icons ti ti-brand-twitter-filled"></i>
            </a>

            <a href="javascript:;" class="btn btn-sm btn-icon rounded-pill btn-text-github me-1_5">
              <i class="tf-icons ti ti-brand-github-filled"></i>
            </a>

            <a href="javascript:;" class="btn btn-sm btn-icon rounded-pill btn-text-google-plus">
              <i class="tf-icons ti ti-brand-google-filled"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- Register Card -->
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
