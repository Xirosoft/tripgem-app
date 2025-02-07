import axios from 'axios'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import config from '../../config/config'

export function useLocationStore() {
  const toast = useToast()
  const locations = ref([])
  const name = ref('')
  const slug = ref('')
  const address = ref('')
  const parentId = ref(0)
  const selectedLocations = ref([])

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/tour/locations/view`, {
        headers: config.getHeaders(),
      })
      locations.value = response.data
    } catch (error) {
      toast.error('Failed to fetch locations', error)
    }
  }

  const getLocation = async (locationId) => {
    try {
      const response = await axios.get(`${config.apiUrl}/tour/location/view/${locationId}`, {
        headers: config.getHeaders(),
      })
      return response.data
    } catch (error) {
      toast.error('Failed to fetch location', error)
      return null
    }
  }

  const addLocation = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/tour/location/add`,
        {
          location_name: name.value,
          location_slug: slug.value,
          formatted_address: address.value,
          parent_id: parentId.value,
        },
        {
          headers: config.getHeaders(),
        },
      )
      if (response.status === 201) {
        fetchLocations()
        toast.success('Location added successfully')
        // Clear form fields
        name.value = ''
        slug.value = ''
        address.value = ''
        parentId.value = 0
      }
    } catch (error) {
      toast.error('Failed to add location', error)
    }
  }

  const editLocation = async (locationId) => {
    try {
      const response = await axios.put(
        `${config.apiUrl}/tour/location/edit/${locationId}`,
        {
          location_name: name.value,
          location_slug: slug.value,
          formatted_address: address.value,
          parent_id: parentId.value,
        },
        {
          headers: config.getHeaders(),
        },
      )
      if (response.status === 200) {
        fetchLocations()
        toast.success('Location updated successfully')
        // Clear form fields
        name.value = ''
        slug.value = ''
        address.value = ''
        parentId.value = 0
      }
    } catch (error) {
      toast.error('Failed to update location', error)
    }
  }

  const deleteLocation = async (locationId) => {
    try {
      const response = await axios.delete(`${config.apiUrl}/tour/location/delete/${locationId}`, {
        headers: config.getHeaders(),
      })
      if (response.status === 200) {
        fetchLocations()
        toast.success('Location deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete location', error)
    }
  }

  const toggleSelectAll = (event) => {
    if (event.target.checked) {
      selectedLocations.value = locations.value.map((location) => location.location_id)
    } else {
      selectedLocations.value = []
    }
  }

  const toggleSelectLocation = (locationId) => {
    const index = selectedLocations.value.indexOf(locationId)
    if (index > -1) {
      selectedLocations.value.splice(index, 1)
    } else {
      selectedLocations.value.push(locationId)
    }
  }

  return {
    locations,
    name,
    slug,
    address,
    parentId,
    fetchLocations,
    addLocation,
    selectedLocations,
    toggleSelectAll,
    toggleSelectLocation,
    editLocation,
    deleteLocation,
    getLocation,
  }
}
