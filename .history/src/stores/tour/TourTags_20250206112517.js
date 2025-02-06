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
      toast.error('Failed to fetch tags', error)
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
        // Clear form fields
        name.value = ''
        slug.value = ''
        description.value = ''
      }
    } catch (error) {
      toast.error('Failed to add tag', error)
    }
  }

  const editTag = async (tag) => {
    try {
      const response = await axios.put(
        `${config.apiUrl}/tour/tag/edit/${tag.tag_id}`,
        {
          name: tag.tag_name,
          slug: tag.tag_slug,
          description: tag.description,
        },
        {
          headers: config.getHeaders(),
        },
      )
      if (response.status === 200) {
        fetchTags()
        toast.success('Tag updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update tag', error)
    }
  }

  const deleteTag = async (tagId) => {
    try {
      const response = await axios.delete(`${config.apiUrl}/tour/tag/delete/${tagId}`, {
        headers: config.getHeaders(),
      })
      if (response.status === 200) {
        fetchTags()
        toast.success('Tag deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete tag', error)
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
    editTag,
    deleteTag,
  }
}
