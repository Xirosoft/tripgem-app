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
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`${config.apiUrl}/merchant/add`, merchantData, {
          headers: config.getHeaders(),
        })
        this.merchants.push(response.data)
        console.log('Merchants:', this.merchants)
        this.loading = false
        this.setMessage('Merchant created successfully', 'success')
        return response.data
      } catch (error) {
        console.error('Error creating merchant:', error)
        this.error = error.response?.data?.message || 'Failed to create merchant'
        this.loading = false
        this.setMessage(this.error, 'danger')
        throw error
      }
    },

    validateMerchantData(data) {
      const errors = {}

      if (!data.company_name) errors.company_name = 'Company name is required'
      if (!data.email_address) errors.email_address = 'Email is required'
      if (!data.phone_number) errors.phone_number = 'Phone number is required'
      if (!data.registration_number) errors.registration_number = 'Registration number is required'

      this.validationErrors = errors
      return Object.keys(errors).length === 0
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
