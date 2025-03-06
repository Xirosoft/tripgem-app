import axios from 'axios'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import config from '../../config/config'

export function useCategoryStore() {
  const toast = useToast()
  const categories = ref([])
  const name = ref('')
  const categorySlug = ref('')
  const description = ref('')
  const parentId = ref(null)
  const selectedCategories = ref([])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/categories/view`, {
        headers: config.getHeaders(),
      })
      categories.value = response.data
      console.log('categories', categories.value)
    } catch (error) {
      toast.error('Failed to fetch categories', error)
    }
  }

  const getCategory = async (categoryId) => {
    try {
      const response = await axios.get(`${config.apiUrl}/category/view/${categoryId}`, {
        headers: config.getHeaders(),
      })
      return response.data
    } catch (error) {
      toast.error('Failed to fetch category', error)
      return null
    }
  }

  const addCategory = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl}/category/add`,
        {
          category_name: name.value,
          category_slug: categorySlug.value,
          description: description.value,
          parent_id: parentId.value,
        },
        {
          headers: config.getHeaders(),
        },
      )
      if (response.status === 201) {
        fetchCategories()
        toast.success('Category added successfully')
        // Clear form fields
        name.value = ''
        categorySlug.value = ''
        description.value = ''
        parentId.value = null
      }
    } catch (error) {
      toast.error('Failed to add category', error)
    }
  }

  const editCategory = async (categoryId) => {
    try {
      const response = await axios.put(
        `${config.apiUrl}/category/edit/${categoryId}`,
        {
          category_name: name.value,
          category_slug: categorySlug.value,
          description: description.value,
          parent_id: parentId.value,
        },
        {
          headers: config.getHeaders(),
        },
      )
      if (response.status === 200) {
        fetchCategories()
        toast.success('Category updated successfully')
        // Clear form fields
        name.value = ''
        categorySlug.value = ''
        description.value = ''
        parentId.value = null
      }
    } catch (error) {
      toast.error('Failed to update category', error)
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(`${config.apiUrl}/category/delete/${categoryId}`, {
        headers: config.getHeaders(),
      })
      if (response.status === 200) {
        fetchCategories()
        toast.success('Category deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete category', error)
    }
  }

  const toggleSelectAll = (event) => {
    if (event.target.checked) {
      selectedCategories.value = categories.value.map((category) => category.category_id)
    } else {
      selectedCategories.value = []
    }
  }

  const toggleSelectCategory = (categoryId) => {
    const index = selectedCategories.value.indexOf(categoryId)
    if (index > -1) {
      selectedCategories.value.splice(index, 1)
    } else {
      selectedCategories.value.push(categoryId)
    }
  }

  return {
    categories,
    name,
    categorySlug,
    description,
    parentId,
    fetchCategories,
    addCategory,
    selectedCategories,
    toggleSelectAll,
    toggleSelectCategory,
    editCategory,
    deleteCategory,
    getCategory,
  }
}
