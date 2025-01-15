import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'
import { merchantDataStructure } from '../../config/merchantData'

export const useMerchantsStore = defineStore('addmerchants', {
  state: () => ({
    merchants: [],
    loading: false,
    error: null,
    message: null,
    messageType: null,
    newMerchant: { ...merchantDataStructure },
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
          headers: {
            ...config.getHeaders(),
          },
        })

        if (!response.data) {
          throw new Error('Failed to create merchant')
        }

        this.loading = false
        return response.data
      } catch (error) {
        this.loading = false
        this.error = error.message
        throw error
      }
    },

    validateMerchantData(data) {
      const requiredFields = [
        'company_name',
        'business_type',
        'user_id',
        'phone_number',
        'email_address',
        'registration_number',
        'contact_person_name',
        'position_designation',
        'headquarters_location',
      ]

      return requiredFields.every((field) => {
        const value = data[field]
        return value !== null && value !== undefined && value !== ''
      })
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
