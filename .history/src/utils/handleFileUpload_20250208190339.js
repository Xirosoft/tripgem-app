import { useToast } from 'vue-toastification'
import config from '../config/config'

export async function handleFileUpload(event, type) {
  const toast = useToast()
  const files = Array.from(event.target.files)
  const uploadedFiles = []

  const formatType = (type) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
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

export async function DragAndDropUpload(file, formData, dropzone, toast, fieldName) {
  if (!file) return

  formData[fieldName] = ''

  return new Promise((resolve, reject) => {
    uploadFile(file, fieldName)
      .then((url) => {
        if (url) {
          formData[fieldName] = url
          toast.success(`${fieldName.replace('_', ' ')} uploaded successfully`)
          resolve(url)
        } else {
          throw new Error('No valid URL received from server')
        }
      })
      .catch((error) => {
        console.error(`${fieldName.replace('_', ' ')} upload failed:`, error)
        if (dropzone) {
          dropzone.removeFile(file)
        }
        toast.error(`${fieldName.replace('_', ' ')} upload failed: ${error.message}`)
        reject(error)
      })
  })
}

async function uploadFile(file, type = 'general') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  try {
    const headers = config.getHeaders()
    delete headers['Content-Type']

    const response = await fetch(`${config.apiUrl}/upload`, {
      method: 'POST',
      body: formData,
      headers,
    })

    const result = await response.json()
    console.log('Upload response:', result)

    if (!response.ok) {
      throw new Error(result.message || `Upload failed: ${response.status}`)
    }

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
