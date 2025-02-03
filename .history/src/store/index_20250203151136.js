import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    formData: {
      address: {
        country: '',
        province: '',
        city: '',
        zip_code: '',
        address_details: '',
      },
      // ...other form data...
    },
  }),
  actions: {
    // Define actions to update formData if needed
  },
})
