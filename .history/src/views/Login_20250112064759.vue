// eslint-disable-next-line vue/multi-word-component-names
<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import TripgemLogo from '@/components/Logo.vue'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()
const authStore = useAuthStore()

const Login = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push({ name: 'AdminDashboard' })
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner py-6">
        <!-- Login -->
        <div class="card">
          <div class="card-body">
            <!-- Logo -->
            <div class="app-brand justify-content-center mb-6">
              <TripgemLogo />
            </div>
            <!-- /Logo -->
            <h4 class="mb-1">Welcome to Tgip! 👋</h4>
            <p class="mb-6">Please sign-in to your account and start the adventure</p>
            <h1>{{ this.messsage =  }}</h1>
            <form id="formAuthentication" class="mb-4" @submit.prevent="Login">
              <div class="mb-6">
                <label for="email" class="form-label">Email or Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  v-model="email"
                  placeholder="Enter your email or username"
                  autofocus
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
                    placeholder="Password"
                    aria-describedby="password"
                  />
                  <span class="input-group-text cursor-pointer"><i class="ti ti-eye-off"></i></span>
                </div>
              </div>
              <div class="my-8">
                <div class="d-flex justify-content-between">
                  <div class="form-check mb-0 ms-2">
                    <input class="form-check-input" type="checkbox" id="remember-me" />
                    <label class="form-check-label" for="remember-me"> Remember Me </label>
                  </div>
                  <RouterLink to="/forgot-password">
                    <p class="mb-0">Forgot Password?</p>
                  </RouterLink>
                </div>
              </div>
              <div class="mb-6">
                <button class="btn btn-primary d-grid w-100" type="submit">Login</button>
              </div>
            </form>

            <p class="text-center">
              <span>New on our platform?</span>

              <RouterLink to="/register">
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

              <a
                href="javascript:;"
                class="btn btn-sm btn-icon rounded-pill btn-text-twitter me-1_5"
              >
                <i class="tf-icons ti ti-brand-twitter-filled"></i>
              </a>

              <a
                href="javascript:;"
                class="btn btn-sm btn-icon rounded-pill btn-text-github me-1_5"
              >
                <i class="tf-icons ti ti-brand-github-filled"></i>
              </a>

              <a href="javascript:;" class="btn btn-sm btn-icon rounded-pill btn-text-google-plus">
                <i class="tf-icons ti ti-brand-google-filled"></i>
              </a>
            </div>
          </div>
        </div>
        <!-- /Register -->
      </div>
    </div>
  </div>
</template>

<style>
.authentication-wrapper {
  display: flex;
  flex-basis: 100%;
  min-height: 100vh;
  width: 100%;
}
.authentication-wrapper .authentication-inner {
  width: 100%;
}
.authentication-wrapper.authentication-basic {
  align-items: center;
  justify-content: center;
}
.authentication-wrapper.authentication-basic .card-body {
  padding: 3rem;
}
@media (max-width: 575.98px) {
  .authentication-wrapper.authentication-basic .card-body {
    padding: 2rem;
  }
}
.authentication-wrapper.authentication-cover {
  align-items: flex-start;
}
.authentication-wrapper.authentication-cover .authentication-inner {
  height: 100%;
  margin: auto 0;
}
@media (max-width: 991.98px) {
  .authentication-wrapper.authentication-cover .authentication-inner {
    height: 100vh;
  }
}
.authentication-wrapper.authentication-cover .authentication-inner .auth-cover-bg {
  width: 100%;
  height: 100vh;
  position: relative;
}
.authentication-wrapper.authentication-cover
  .authentication-inner
  .auth-cover-bg
  .auth-illustration {
  max-height: 65%;
  max-width: 65%;
  z-index: 1;
}
.authentication-wrapper.authentication-cover .authentication-inner .platform-bg {
  position: absolute;
  width: 100%;
  bottom: 0%;
  left: 0%;
  height: 35%;
}
.authentication-wrapper.authentication-cover .authentication-inner .auth-multisteps-bg-height {
  height: 100vh;
}
.authentication-wrapper.authentication-cover
  .authentication-inner
  .auth-multisteps-bg-height
  > img:first-child {
  z-index: 1;
}
.authentication-wrapper.authentication-basic .authentication-inner {
  max-width: 460px;
  position: relative;
}
.authentication-wrapper.authentication-basic .authentication-inner:before {
  width: 238px;
  height: 233px;
  content: ' ';
  position: absolute;
  top: -35px;
  left: -45px;
  background-image: url("data:image/svg+xml,%3Csvg width='239' height='234' viewBox='0 0 239 234' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='88.5605' y='0.700195' width='149' height='149' rx='19.5' stroke='%237367F0' stroke-opacity='0.16'/%3E%3Crect x='0.621094' y='33.761' width='200' height='200' rx='10' fill='%237367F0' fill-opacity='0.08'/%3E%3C/svg%3E%0A");
}
@media (max-width: 575.98px) {
  .authentication-wrapper.authentication-basic .authentication-inner:before {
    display: none;
  }
}
.authentication-wrapper.authentication-basic .authentication-inner:after {
  width: 180px;
  height: 180px;
  content: ' ';
  position: absolute;
  z-index: -1;
  bottom: -30px;
  right: -56px;
  background-image: url("data:image/svg+xml,%3Csvg width='181' height='181' viewBox='0 0 181 181' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1.30469' y='1.44312' width='178' height='178' rx='19' stroke='%237367F0' stroke-opacity='0.16' stroke-width='2' stroke-dasharray='8 8'/%3E%3Crect x='22.8047' y='22.9431' width='135' height='135' rx='10' fill='%237367F0' fill-opacity='0.08'/%3E%3C/svg%3E");
}
@media (max-width: 575.98px) {
  .authentication-wrapper.authentication-basic .authentication-inner:after {
    display: none;
  }
}
.authentication-wrapper .auth-input-wrapper .auth-input {
  max-width: 50px;
  padding-left: 0.4rem;
  padding-right: 0.4rem;
  font-size: 150%;
}

@media (max-height: 636px) {
  .auth-multisteps-bg-height {
    height: 100% !important;
  }
}
@media (max-width: 575.98px) {
  .authentication-wrapper .auth-input-wrapper .auth-input {
    font-size: 1.125rem;
  }
}
#twoStepsForm .fv-plugins-bootstrap5-row-invalid .form-control {
  border-color: #ff4c51;
  border-width: 2px;
}

@media (max-width: 575.98px) {
  .numeral-mask-wrapper .numeral-mask {
    padding: 0 !important;
  }
  .numeral-mask {
    margin-inline: 1px !important;
  }
}
.light-style .authentication-wrapper .authentication-bg {
  background-color: #fff;
}
.light-style .auth-cover-bg-color {
  background-color: #f8f7fa;
}

.dark-style .authentication-wrapper .authentication-bg {
  background-color: #2f3349;
}
.dark-style .auth-cover-bg-color {
  background-color: #25293c;
}
</style>
