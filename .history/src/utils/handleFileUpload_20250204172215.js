import { useToast } from 'vue-toastification'
import config from '../config/config'

export async function handleFileUpload(event, type) {
  const toast = useToast()
  const files = Array.from(event.target.files)
  const uploadedFiles = []

  const formatType = (type) => {
    return type
      .split('_') // Split the string into an array by underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' ') // Join the array back into a string with spaces
  }

  try {
    const uploadPromises = files.map((file) => uploadFile(file, type))
    const urls = await Promise.all(uploadPromises)
    uploadedFiles.push(...urls)

    const formattedType = formatType(type)
    toast.success(`${formattedType} uploaded successfully`)
    return uploadedFiles
  } catch (error) {
    const formattedType = formatType(type)
    console.error(`${formattedType} upload failed:`, error)
    toast.error(`Failed to upload ${formattedType}: ${error.message}`)
    return []
  }
}

export async function DragAndDropUpload(file, formData, dropzone, toast, selector) {
  if (!file) return

  // formData.logo_url = ''
  formData.selector = ''

  // Create a promise to handle the upload
  return new Promise((resolve, reject) => {
    uploadFile(file, selector)
      .then((url) => {
        if (url) {
          formData.logo_url = url
          formData.cover_photo = url
          toast.success('Logo uploaded successfully')
          resolve(url)
        } else {
          throw new Error('No valid URL received from server')
        }
      })
      .catch((error) => {
        console.error('Logo upload failed:', error)
        if (dropzone) {
          dropzone.removeFile(file)
        }
        toast.error(`Logo upload failed: ${error.message}`)
        reject(error)
      })
  })
}

async function uploadFile(file, type = 'general') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type) // Add file type for backend processing

  try {
    const headers = config.getHeaders()
    delete headers['Content-Type']

    const response = await fetch(`${config.apiUrl}/upload`, {
      method: 'POST',
      body: formData,
      headers,
    })

    const result = await response.json()
    console.log('Upload response:', result) // Debug response

    if (!response.ok) {
      throw new Error(result.message || `Upload failed: ${response.status}`)
    }

    // Check all possible URL fields in response
    const fileUrl = result.file_url || result.url || result.data?.url || result.data?.file_url

    if (!fileUrl) {
      console.error('Invalid server response:', result)
      throw new Error('Server did not return a valid file URL')
    }

    return { url: fileUrl }
  } catch (error) {
    console.error(`Upload error (${type}):`, error)
    throw error
  }
}
