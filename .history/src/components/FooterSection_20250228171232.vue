<script>
export default {
  name: 'FooterSection',
  data() {
    return {
      currentYear: new Date().getFullYear(),
    }
  },
}
</script>

<template>
  <!-- Footer -->
  <footer class="content-footer footer bg-footer-theme">
    <div class="container-fluid">
      <div
        class="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column"
      >
        <div class="text-body">
          ©
          {{ currentYear }}
          , made with ❤️ by
          <a href="https://akerio.net" target="_blank" class="footer-link">Akerio</a>
        </div>
        <div class="d-none d-lg-inline-block">
          <a
            href="https://themeforest.net/licenses/standard"
            class="footer-link me-4"
            target="_blank"
            >License</a
          >
          <a href="#" target="_blank" class="footer-link me-4">More Themes</a>

          <a href="#" target="_blank" class="footer-link me-4">Documentation</a>

          <a href="#" target="_blank" class="footer-link d-none d-sm-inline-block">Support</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss"></style>
