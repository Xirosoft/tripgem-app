<script setup></script>

<template>
  <ul class="dropdown-menu dropdown-menu-end">
    <li>
      <a class="dropdown-item mt-0" href="pages-account-settings-account.html">
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0 me-2">
            <div class="avatar avatar-online">
              <img src="/src/frontend/assets/img/avatars/1.png" alt class="rounded-circle" />
            </div>
          </div>
          <div class="flex-grow-1">
            <h6 class="mb-0">John Doe</h6>
            <small class="text-muted">Admin</small>
          </div>
        </div>
      </a>
    </li>
    <li>
      <div class="dropdown-divider my-1 mx-n2"></div>
    </li>
    <li>
      <a class="dropdown-item" href="pages-profile-user.html">
        <i class="ti ti-user me-3 ti-md"></i><span class="align-middle">My Profile</span>
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="pages-account-settings-account.html">
        <i class="ti ti-settings me-3 ti-md"></i><span class="align-middle">Settings</span>
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="pages-account-settings-billing.html">
        <span class="d-flex align-items-center align-middle">
          <i class="flex-shrink-0 ti ti-file-dollar me-3 ti-md"></i
          ><span class="flex-grow-1 align-middle">Billing</span>
          <span
            class="flex-shrink-0 badge bg-danger d-flex align-items-center justify-content-center"
            >4</span
          >
        </span>
      </a>
    </li>
    <li>
      <div class="dropdown-divider my-1 mx-n2"></div>
    </li>
    <li>
      <a class="dropdown-item" href="pages-pricing.html">
        <i class="ti ti-currency-dollar me-3 ti-md"></i><span class="align-middle">Pricing</span>
      </a>
    </li>
    <li>
      <a class="dropdown-item" href="pages-faq.html">
        <i class="ti ti-question-mark me-3 ti-md"></i><span class="align-middle">FAQ</span>
      </a>
    </li>
    <li>
      <div class="d-grid px-2 pt-2 pb-1">
        <a class="btn btn-sm btn-danger d-flex" href="auth-login-cover.html" target="_blank">
          <small class="align-middle">Logout</small>
          <i class="ti ti-logout ms-2 ti-14px"></i>
        </a>
      </div>
    </li>
  </ul>
</template>

<style lang="scss"></style>
