<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref } from 'vue'
import config from '../../config/config'

const categories = ref([])
const selectedParentCategory = ref(null)
const categorySelectRef = ref(null)
const showAddCategoryForm = ref(false)

const loadingCategories = ref(false)

const sortCategories = (categories) => {
  const sortedCategories = []
  const categoryMap = new Map()

  categories.forEach(category => {
    categoryMap.set(category.category_id, { ...category, children: [] })
  })

  categoryMap.forEach(category => {
    if (category.parent_id) {
      categoryMap.get(category.parent_id).children.push(category)
    } else {
      sortedCategories.push(category)
    }
  })

  const flattenCategories = (categories) => {
    return categories.reduce((acc, category) => {
      acc.push(category)
      if (category.children.length) {
        acc.push(...flattenCategories(category.children))
      }
      return acc
    }, [])
  }

  return flattenCategories(sortedCategories)
}

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await axios.get(`${config.apiUrl}/tour/categories/view`, {
      headers: config.getHeaders(),
    })
    categories.value = sortCategories(response.data)
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loadingCategories.value = false
  }
}

const addCategory = async (category) => {
  try {
    const response = await axios.post(`${config.apiUrl}/tour/category/add`, category, {
      headers: config.getHeaders(),
    })
    console.log('Category added:', response.data)
    await fetchCategories()
  } catch (error) {
    console.error('Error adding category:', error)
  }
}

const getIndentedCategoryName = (category) => {
  const indent = category.parent_id ? '\u00A0\u00A0\u00A0\u00A0' : ''
  return `${indent}${category.category_name}`
}

onMounted(async () => {
  await fetchCategories()
  nextTick(() => {
    $(categorySelectRef.value).select2()
  })
})
</script>

<template>
   <div>
  <label for="ecommerce-product-tags" class="form-label mb-1">Tags</label>
  <input
    id="ecommerce-product-tags"
    class="form-control"
    name="ecommerce-product-tags"
    value=""
    aria-label="Tour Tags"
  />
</div>
</template>

<style>
@import 'select2/dist/css/select2.css';

</style>

