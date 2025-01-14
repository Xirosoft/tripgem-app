import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    startTime: '',
    endTime: '',
    otp_verify: '',
  }),
  actions: {
    setEmail(email) {
      this.email = email
    },
    setStartTime(startTime) {
      this.startTime = startTime
    },
    setEndTime(endTime) {
      this.endTime = endTime
    },
    setEndTime(endTime) {
      this.endTime = endTime
    },
  },
  persist: true,
})
