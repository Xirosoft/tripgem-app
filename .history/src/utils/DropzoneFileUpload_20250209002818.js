import config from '../config/config'

export async function DragAndDropUpload(file, formData, dropzone, toast, fieldName) {
  if (!file) return

  formData[fieldName] = ''

  // Create a promise to handle the upload
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
