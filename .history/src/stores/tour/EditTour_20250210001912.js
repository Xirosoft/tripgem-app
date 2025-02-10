import axios from 'axios'
import config from '../../config/config'

export const useEditTourStore = () => {
  const fetchTourDetails = async (id) => {
    try {
      const response = await axios.get(`${config.apiUrl}/tour/view/${id}`, {
        headers: config.getHeaders(),
      })
      return response.data
    } catch (error) {
      console.error('Error fetching tour details:', error)
      throw error
    }
  }

  const updateTourDetails = async (id, tourData) => {
    try {
      const response = await axios.put(`${config.apiUrl}/tour/edit/${id}`, tourData, {
        headers: config.getHeaders(),
      })
      return response.data
    } catch (error) {
      console.error('Error updating tour details:', error)
      throw error
    }
  }

  return {
    fetchTourDetails,
    updateTourDetails,
  }
}
