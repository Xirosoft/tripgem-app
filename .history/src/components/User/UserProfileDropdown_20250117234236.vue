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

<template></template>

<style lang="scss"></style>
