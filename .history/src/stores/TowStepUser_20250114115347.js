import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    startTime: '',
    endTime: '',
  }),
  actions: {
    setEmail(email) {
      this.email = email
    },
    setstartTime(email) {
      this.email = email
    },
    setendTime(email) {
      this.email = email
    },
  },
})
