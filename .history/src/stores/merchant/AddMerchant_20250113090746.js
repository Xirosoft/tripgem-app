import { defineStore } from 'pinia'
import axios from 'axios'
import config from '../../config/config'

export const useMerchantsStore = defineStore('merchants', {
  state: () => ({
    merchants: [],
    loading: false,
    error: null,
    message: null,
    messageType: null,
    newMerchant: {
      user_id: 10,
      company_name: '',
      logo_url: '',
      slogan: '',
      registration_number: '',
      established_year: null,
      headquarters_location: '',
      branch_locations: [],
      business_type: '',
      address: '',
      phone_number: '',
      email_address: '',
      website: '',
      social_media_links: {
        facebook: '',
        twitter: '',
      },
      contact_person_name: '',
      position_designation: '',
      emergency_contact_number: '',
      tourism_license_number: '',
      tin: '',
      business_permits: [],
      membership_certificates: [],
      documents: [],
    },
    validationErrors: {},
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
        const response = await axios.get(`${config.apiUrl}/merchant/add`, {
          headers: config.getHeaders(),
        })
        this.merchants = Array.isArray(response.data) ? response.data : response.data.data
        console.log('Merchants:', this.merchants)

        this.loading = false
        this.setMessage('Merchants loaded successfully', 'success')
      } catch (error) {
        console.error('Error fetching merchants:', error)
        this.error = error.message || 'Failed to fetch merchants'
        this.loading = false
        this.setMessage(this.error, 'danger')
        throw error
      }
    },

    async createMerchant(merchantData) {
      console.log('Merchants:', merchantData)
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/merchants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any auth headers if needed
          },
          body: JSON.stringify(merchantData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to create merchant')
        }

        return await response.json()
      } catch (error) {
        console.error('Create merchant error:', error)
        throw error
      }
    },

    validateMerchantData(data) {
      const requiredFields = [
        'company_name',
        'business_type',
        'registration_number',
        'headquarters_location',
        'address',
        'phone_number',
        'email_address',
        'contact_person_name',
        'position_designation',
      ]

      for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
          return false
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email_address)) {
        return false
      }

      return true
    },

    resetNewMerchant() {
      this.newMerchant = {
        user_id: null,
        company_name: '',
        logo_url: '',
        slogan: '',
        registration_number: '',
        established_year: null,
        headquarters_location: '',
        branch_locations: [],
        business_type: '',
        address: '',
        phone_number: '',
        email_address: '',
        website: '',
        social_media_links: {
          facebook: '',
          twitter: '',
          instagram: '',
          youtube: '',
        },
        contact_person_name: '',
        position_designation: '',
        emergency_contact_number: '',
        tourism_license_number: '',
        tin: '',
        business_permits: [],
        membership_certificates: [],
        documents: [],
      }
      this.validationErrors = {}
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
    getValidationErrors: (state) => state.validationErrors,
    isFormValid: (state) => Object.keys(state.validationErrors).length === 0,
  },
})
