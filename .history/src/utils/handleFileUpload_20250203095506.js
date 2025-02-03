import axios from 'axios'
import config from '../config/config'

export async function handleFileUpload(event, field, formData, toast) {
  const files = event.target.files
  if (files.length) {
    const fileData = new FormData()
    fileData.append('file', files[0])

    try {
      const response = await axios.post(`${config.apiUrl}/upload`, fileData, {
        headers: {
          ...config.getHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      })
      formData[field].push(response.data.url)
      toast.success('File uploaded successfully')
    } catch (error) {
      console.error('File upload error:', error)
      toast.error('Failed to upload file')
    }
  }
}

export async function handleLogoUpload(file, formData, dropzone, toast) {
  if (!file) return

  formData.logo_url = ''

  // Create a promise to handle the upload
  return new Promise((resolve, reject) => {
    uploadFile(file, 'logo')
      .then((url) => {
        if (url) {
          formData.logo_url = url
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

    return fileUrl
  } catch (error) {
    console.error(`Upload error (${type}):`, error)
    throw error
  }
}
