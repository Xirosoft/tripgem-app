import axios from 'axios'
import config from '../config/config'

export const handleSubmit = async (email, message, messageType) => {
  try {
    const response = await axios.post(
      `${config.apiBaseUrl}/forget-password`,
      {
        email: email.value,
      },
      {
        headers: config.getHeaders(),
      },
    )
    if (response.data.status === 'success') {
      message.value = response.data.message
      messageType.value = 'success'
    } else {
      message.value = 'Unexpected response from server.'
      messageType.value = 'error'
    }
  } catch (error) {
    if (error.response && error.response.data.code === 'user_not_found') {
      message.value = error.response.data.message
      messageType.value = 'error'
    } else {
      message.value = 'Failed to send reset link. Please try again.'
      messageType.value = 'error'
    }
  }
}
