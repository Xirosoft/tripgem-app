import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    startTime: '',
    endTime: '',
    otpVerify: '',
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
    setOtpVerify(otpVerify) {
      this.otpVerify = otpVerify
    },
  },
  persist: true,
})
