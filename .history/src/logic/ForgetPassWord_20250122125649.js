import axios from 'axios'
import config from '../config/config'

export const handleSubmit = async (email, message, messageType) => {
  return async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${config.apiBaseUrl}/forget-password`, {
        email: email.value,
      })
      message.value = 'Reset link sent successfully!'
      messageType.value = 'success'
    } catch (error) {
      message.value = 'Failed to send reset link. Please try again.'
      messageType.value = 'error'
    }
  }
}
