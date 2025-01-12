import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../config/config'

export const useMerchantsStore = defineStore('merchants', {
  state: () => ({
    merchants: [],
    loading: false,
    error: null,
    message: null,
    messageType: null,
  }),

  actions: {
    setMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
    },

    async fetchMerchants() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(`${config.apiUrl}/merchants/view`, {
          headers: config.getHeaders(),
        })
        this.merchants = response.data
        this.loading = false
        this.setMessage('Merchants loaded successfully', 'success')
      } catch (error) {
        this.error = error.message || 'Failed to fetch merchants'
        this.loading = false
        this.setMessage(this.error, 'danger')
        throw error
      }
    },

    clearMessage() {
      this.message = null
      this.messageType = null
    },
  },

  getters: {
    getMerchantById: (state) => {
      return (id) => state.merchants.find((merchant) => merchant.id === id)
    },
    getAllMerchants: (state) => state.merchants,
  },
})

export default [
  {
    id: '9',
    company_name: 'Shah Travel Travels',
    logo_url: 'http://example.com/logo.jpg',
    slogan: 'Experience the World',
    registration_number: '123456789',
    business_type: 'Tourism',
    phone_number: '+1234567890',
    email_address: 'info@amazingtours.com',
    status: 'pending',
    established_year: '2010',
    headquarters_location: 'New York',
    branch_locations: ['California', 'Florida'],
    address: '123 Main St, New York, NY 10001',
    website: 'http://amazingtours.com',
    social_media_links: {
      facebook: 'http://facebook.com/amazingtours',
      twitter: 'http://twitter.com/amazingtours',
    },
    contact_person_name: 'John Doe',
    position_designation: 'CEO',
    created_at: '2024-12-28 08:36:16',
    updated_at: '2025-01-02 07:02:56',
  },
  // You can add more sample merchants here
]
