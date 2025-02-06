import axios from 'axios'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import config from '../../config/config'

export function useRolesListStore() {
  const toast = useToast()
  const tags = ref([])
  const name = ref('')
  const slug = ref('')
  const description = ref('')
  const selectedTags = ref([])

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/tour/tags/view`, {
        headers: config.getHeaders(),
      })
      tags.value = response.data
    } catch (error) {
      toast.error('Failed to fetch tags')
    }
  }

  const addTag = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/tour/tag/add`,
        {
          name: name.value,
          slug: slug.value,
          description: description.value,
        },
        {
          headers: config.getHeaders(),
        },
      )
      if (response.status === 201) {
        fetchTags()
        toast.success('Tag added successfully')
      }
    } catch (error) {
      toast.error('Failed to add tag', error)
    }
  }

  const toggleSelectAll = (event) => {
    if (event.target.checked) {
      selectedTags.value = tags.value.map((tag) => tag.tag_id)
    } else {
      selectedTags.value = []
    }
  }

  const toggleSelectTag = (tagId) => {
    const index = selectedTags.value.indexOf(tagId)
    if (index > -1) {
      selectedTags.value.splice(index, 1)
    } else {
      selectedTags.value.push(tagId)
    }
  }

  return {
    tags,
    name,
    slug,
    description,
    fetchTags,
    addTag,
    selectedTags,
    toggleSelectAll,
    toggleSelectTag,
  }
}
