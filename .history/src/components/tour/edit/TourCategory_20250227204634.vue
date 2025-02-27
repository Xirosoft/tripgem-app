<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref } from 'vue'
import config from '../../../config/config'

const emit = defineEmits(['category-change'])

const categories = ref([])
const currentCategory = ref(null)
const selectedParentCategory = ref(null)
const categorySelectRef = ref(null)
const showAddCategoryForm = ref(false)
const newCategoryName = ref('')
const newCategorySlug = ref('')
const newCategoryDescription = ref('')
const loadingCategories = ref(false)

const sortCategories = (categories) => {
  const sortedCategories = []
  const categoryMap = new Map()

  categories.forEach((category) => {
    categoryMap.set(category.category_id, { ...category, children: [] })
  })

  categoryMap.forEach((category) => {
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

const initializeSelect2 = () => {
  if (!categorySelectRef.value) return
  nextTick(() => {
    $(categorySelectRef.value)
      .select2({
        data: categories.value.map((category) => ({
          id: category.category_id.toString(),
          text: category.category_name,
        })),
      })
      .on('select2:select', (e) => {
        const selectedId = e.params.data.id
        const selectedCategory = categories.value.find(
          (category) => category.category_id.toString() === selectedId,
        )
        currentCategory.value = selectedCategory ? selectedCategory.category_name : null
        console.log('Selected Category:', selectedCategory)
        emit('category-change', selectedCategory)
      })
      .val(
        categories.value.find((category) => category.category_name === props.selectedCategory)
          ?.category_id || '',
      )
      .trigger('change')

    console.log('Selected Category:', props.selectedCategory)
  })
}

const props = defineProps({
  selectedCategory: String,
})

onMounted(async () => {
  await fetchCategories()
  initializeSelect2()
})
</script>

<template>
  <!-- Collection -->
  <div class="mb-6 col ecommerce-select2-dropdown">
    <label class="form-label mb-1" for="collection">Category</label>
    <select
      id="collection"
      class="select2 form-select"
      data-placeholder="Category"
      ref="categorySelectRef"
    >
      <option value="">Select Category</option>
      <option
        v-for="category in categories"
        :key="category.category_id"
        :value="category.category_id"
      >
        {{ getIndentedCategoryName(category) }}
      </option>
    </select>
  </div>
  <!-- Toggle Add Category Form -->
  <div class="mb-6 col">
    <a
      @click="showAddCategoryForm = !showAddCategoryForm"
      href="javascript:void(0)"
      class="btn-link"
    >
      {{ showAddCategoryForm ? 'Hide Add Category Form' : 'Add New Category' }}
    </a>
  </div>
  <!-- Add Category Form -->
  <div v-if="showAddCategoryForm" class="mb-6 col">
    <label class="form-label mb-1" for="new-category">Add New Category</label>
    <input
      id="new-category"
      v-model="newCategoryName"
      class="form-control"
      placeholder="Category Name"
    />
    <input
      id="new-category-slug"
      v-model="newCategorySlug"
      class="form-control mt-2"
      placeholder="Category Slug"
    />
    <input
      id="new-category-description"
      v-model="newCategoryDescription"
      class="form-control mt-2"
      placeholder="Category Description"
    />
    <select
      id="parent-category"
      v-model="selectedParentCategory"
      class="form-select mt-2"
      data-placeholder="Select Parent Category"
    >
      <option value="">Select Parent Category</option>
      <option
        v-for="category in categories"
        :key="category.category_id"
        :value="category.category_id"
      >
        {{ getIndentedCategoryName(category) }}
      </option>
    </select>
    <button
      @click="
        addCategory({
          category_name: newCategoryName,
          category_slug: newCategorySlug,
          category_description: newCategoryDescription,
          parent_id: selectedParentCategory,
        })
      "
      class="btn btn-primary mt-2"
    >
      Add Category
    </button>
  </div>
  <!-- Status -->
</template>

<style>
@import 'select2/dist/css/select2.css';

body .select2-container .select2-selection--single {
  height: auto;
}
body .select2-container--default .select2-selection--single .select2-selection__arrow {
  height: 36px;
  right: 7px;
}
</style>
