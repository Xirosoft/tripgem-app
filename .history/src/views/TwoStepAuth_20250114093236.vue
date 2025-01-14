<script>
import TripgemLogo from '@/components/Logo.vue'

export default {
  name: 'TwoStepAuth',
  components: {
    TripgemLogo,
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
              We sent a verification code to your mobile. Enter the code from the Email in the field below.
              <span class="fw-medium d-block mt-1 text-heading">******1234</span>
            </p>
            <p class="mb-0">Type your 6 digit security code</p>
            <form id="twoStepsForm" action="index.html" method="GET">
              <div class="mb-6">
                <div class="auth-input-wrapper d-flex align-items-center justify-content-between numeral-mask-wrapper">
                  <input
                    type="tel"
                    class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                    maxlength="1"
                    autofocus />
                  <input
                    type="tel"
                    class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                    maxlength="1" />
                  <input
                    type="tel"
                    class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                    maxlength="1" />
                  <input
                    type="tel"
                    class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                    maxlength="1" />
                  <input
                    type="tel"
                    class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                    maxlength="1" />
                  <input
                    type="tel"
                    class="form-control auth-input h-px-50 text-center numeral-mask mx-sm-1 my-2"
                    maxlength="1" />
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