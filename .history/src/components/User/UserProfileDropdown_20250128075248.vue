<script setup>
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/user'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'tripgemlogin' })
}
onMounted(() => {
  usersStore.fetchUserDetails()
})

const user = computed(() => usersStore.getUser)
const userName = computed(() =>
  user.value ? `${user.value.first_name} ${user.value.last_name}` : '',
)
const userRole = computed(() => usersStore.getUserRole)
</script>

<template>
  <!-- <li>
      <router-link
        class="dropdown-item mt-0"
        :to="{ name: 'ViewUser', params: { userId: user.value.id } }"
      >
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0 me-2">
            <div class="avatar avatar-online">
              <img src="/src/frontend/assets/img/avatars/1.png" alt class="rounded-circle" />
            </div>
          </div>
          <div class="flex-grow-1">
            <h6 class="mb-0">{{ userName }}</h6>
            <small class="text-muted">{{ userRole }}</small>
          </div>
        </div>
      </router-link>
    </li>
    <li>
      <div class="dropdown-divider my-1 mx-n2"></div>
    </li>
    <li>
      <router-link
        class="dropdown-item"
        :to="{ name: 'ViewUser', params: { userId: user.value.id } }"
      >
        <small class="text-muted">My Profile</small>
      </router-link>
    </li> -->

  <ul class="dropdown-menu dropdown-menu-end">
    <li>
      <a class="dropdown-item mt-0" href="pages-account-settings-account.html">
        <router-link
          class="dropdown-item mt-0"
          :to="'/users/edit/' + authStore.userId"
        ></router-link>
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0 me-2">
            <div class="avatar avatar-online">
              <img src="/src/frontend/assets/img/avatars/1.png" alt class="rounded-circle" />
            </div>
          </div>
          <div class="flex-grow-1">
            <h6 class="mb-0">{{ userName }}</h6>
            <small class="text-muted">{{ userRole }}</small>
          </div>
        </div>
      </a>
    </li>
    <li>
      <div class="dropdown-divider my-1 mx-n2"></div>
    </li>
    <li>
      <router-link class="dropdown-item waves-effect" :to="'/users/edit/' + authStore.userId">
        <i class="ti ti-user me-3 ti-md"></i><span class="align-middle">My Profile</span>
      </router-link>
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
        <a class="btn btn-sm btn-danger d-flex" href="#" @click.prevent="handleLogout">
          <small class="align-middle">Logout</small>
          <i class="ti ti-logout ms-2 ti-14px"></i>
        </a>
      </div>
    </li>
  </ul>
</template>

<style lang="scss"></style>
