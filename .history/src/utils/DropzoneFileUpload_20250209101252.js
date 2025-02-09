import Dropzone from 'dropzone'
import 'dropzone/dist/dropzone.css'
import config from '../config/config'

export async function DragAndDropUpload(file, formData, dropzone, toast, fieldName) {
  if (!file) return

  // Create a promise to handle the upload
  return new Promise((resolve, reject) => {
    uploadFile(file, fieldName)
      .then((url) => {
        if (url) {
          if (fieldName === 'image_gallery' || fieldName === 'video_gallery') {
            formData[fieldName].push(url)
          } else {
            formData[fieldName] = url
          }
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

export function initializeDropzone(elementId, uploadHandler, formData, toast, multiple = false) {
  const dropzoneElement = document.querySelector(elementId)
  if (!dropzoneElement) return null

  const previewTemplate = `<div class="dz-preview dz-file-preview">
    <div class="dz-details">
      <div class="dz-thumbnail">
        <img data-dz-thumbnail>
        <video data-dz-video controls style="display: none;"></video>
        <span class="dz-nopreview">No preview</span>
        <div class="dz-success-mark"></div>
        <div class="dz-error-mark"></div>
        <div class="dz-error-message"><span data-dz-errormessage></span></div>
        <div class="progress">
          <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div>
        </div>
      </div>
      <div class="dz-filename" data-dz-name></div>
      <div class="dz-size" data-dz-size></div>
    </div>
  </div>`

  const dropzoneInstance = new Dropzone(dropzoneElement, {
    url: `${config.apiUrl}/uploads`,
    // headers: config.getHeaders(),
    previewTemplate,
    parallelUploads: multiple ? 10 : 1,
    maxFilesize: 5,
    acceptedFiles: '.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov',
    addRemoveLinks: true,
    maxFiles: multiple ? null : 1,
    autoProcessQueue: false,
    timeout: 180000,
    createImageThumbnails: true,
    dictDefaultMessage: 'Drop files here or click to upload',
    dictFileTooBig: 'File is too big ({{filesize}}MB). Max filesize: {{maxFilesize}}MB.',
    dictInvalidFileType: 'Invalid file type.',
  })

  dropzoneInstance.on('addedfile', (file) => {
    if (!multiple && dropzoneInstance.files.length > 1) {
      dropzoneInstance.removeFile(dropzoneInstance.files[0])
    }
    if (file.type.startsWith('video/')) {
      const videoElement = file.previewElement.querySelector('[data-dz-video]')
      const imgElement = file.previewElement.querySelector('[data-dz-thumbnail]')
      imgElement.style.display = 'none'
      videoElement.style.display = 'block'
      videoElement.src = URL.createObjectURL(file)
    }
    uploadHandler(file, formData, dropzoneInstance, toast)
  })

  dropzoneInstance.on('addedfiles', (files) => {
    if (multiple) {
      uploadHandler(files, formData, dropzoneInstance, toast)
    }
  })

  dropzoneInstance.on('removedfile', (file) => {
    if (elementId === '#thumbnail') {
      formData.thumbnail = ''
    } else if (elementId === '#image_gallery') {
      formData.image_gallery = formData.image_gallery.filter((url) => url !== file.upload.url)
    } else if (elementId === '#video_gallery') {
      formData.video_gallery = formData.video_gallery.filter((url) => url !== file.upload.url)
    }
  })

  dropzoneInstance.on('error', (file) => {
    dropzoneInstance.removeFile(file)
    toast.error('Failed to upload file.')
  })

  dropzoneInstance.on('uploadprogress', (file, progress) => {
    toast.info(`Uploading ${file.name}: ${progress.toFixed(2)}%`, {
      timeout: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
    })
  })

  dropzoneInstance.on('success', (file, response) => {
    toast.clear()
    toast.success('Upload success!')
    console.log('Upload success:', response)
  })

  return dropzoneInstance
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
