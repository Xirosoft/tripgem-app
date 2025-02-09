import axios from 'axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import config from '../../config/config'

export const useToursStore = defineStore('addtours', {
  state: () => ({
    tours: [],
    loading: false,
    error: null,
    message: null,
    messageType: null,
    newTour: {},
    validationErrors: {},
  }),

  actions: {
    setMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
    },

    async createTour(tourData) {
      const toast = useToast() // Ensure this is inside the method
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${config.apiUrl}/tour/add`, tourData, {
          headers: config.getHeaders(),
        })

        if (!response.data) {
          throw new Error('Failed to create tour')
        }

        this.loading = false
        console.log('Create tour response:', response.data)

        return response.data
      } catch (error) {
        console.log('Create tour error:', error)

        this.loading = false
        this.error = error.response?.data?.message || error.message
        toast.error(this.error, {
          position: 'top-right',
          duration: 5000,
        })
        throw error
      }
    },

    validateTourData(data) {
      const requiredFields = [
        'merchant_id',
        'user_id',
        'tour_name',
        'description',
        'tour_start_time',
        'tour_end_time',
        'regular_price_adult',
        'net_price_adult',
        'regular_price_child',
        'net_price_child',
        'available_dates',
        'available_seat',
        'total_seat',
        'thumbnail',
        'transport_types',
        'languages_supported',
        'highlights',
        'min_age',
        'max_age',
        'cancellation_policy',
        'discount_percentage',
        'tour_type',
        'currency',
        'status',
      ]

      return requiredFields.every((field) => {
        const value = data[field]
        return value !== null && value !== undefined && value !== ''
      })
    },

    resetNewTour() {
      this.newTour = {
        merchant_id: null,
        user_id: null,
        tour_name: '',
        subheading: '',
        description: '',
        itinerary: '',
        tour_start_time: '',
        tour_end_time: '',
        regular_price_adult: 0,
        net_price_adult: 0,
        regular_price_child: 0,
        net_price_child: 0,
        available_dates: '',
        available_seat: 0,
        total_seat: 0,
        image_gallery: [],
        video_gallery: [],
        thumbnail: '',
        transport_types: '',
        languages_supported: '',
        highlights: '',
        min_age: 0,
        max_age: 0,
        cancellation_policy: '',
        discount_percentage: 0,
        tour_type: '',
        currency: '',
        status: 'draft',
      }
      this.validationErrors = {}
    },

    clearMessage() {
      this.message = null
      this.messageType = null
    },
  },

  getters: {
    getTourById: (state) => {
      return (id) => state.tours.find((tour) => tour.id === id)
    },
    getAllTours: (state) => state.tours,
    getValidationErrors: (state) => state.validationErrors,
    isFormValid: (state) => Object.keys(state.validationErrors).length === 0,
  },
})
