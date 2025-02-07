<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import config from '../../config/config'

const tags = ref([])
const selectedTags = ref([])
const tagSelectRef = ref(null)
const showAddTagForm = ref(false)

const loadingTags = ref(false)

const fetchTags = async () => {
  loadingTags.value = true
  try {
    const response = await axios.get(`${config.apiUrl}/tour/tags/view`, {
      headers: config.getHeaders(),
    })
    tags.value = response.data
  } catch (error) {
    console.error('Error fetching tags:', error)
  } finally {
    loadingTags.value = false
  }
}

const addTag = async (tag) => {
  try {
    const response = await axios.post(`${config.apiUrl}/tour/tag/add`, {
      name: tag.tag_name,
      slug: tag.tag_slug,
      description: tag.tag_description
    }, {
      headers: config.getHeaders(),
    })
    console.log('Tag added:', response.data)
    await fetchTags()
  } catch (error) {
    console.error('Error adding tag:', error)
  }
}

const getTagName = (tag) => {
  return tag.tag_name
}

onMounted(async () => {
  await fetchTags()
  nextTick(() => {
    $(tagSelectRef.value).select2({
      tags: true,
      data: tags.value.map(tag => ({ id: tag.tag_id, text: tag.tag_name })),
      createTag: (params) => {
        const term = $.trim(params.term)
        if (term === '') {
          return null
        }
        return {
          id: term,
          text: term,
          newTag: true
        }
      }
    }).on('select2:select', async (e) => {
      const data = e.params.data
      if (data.newTag) {
        await addTag({ tag_name: data.text })
      }
    })
  })
})

watch(tags, () => {
  $(tagSelectRef.value).select2({
    tags: true,
    data: tags.value.map(tag => ({ id: tag.tag_id, text: tag.tag_name })),
    createTag: (params) => {
      const term = $.trim(params.term)
      if (term === '') {
        return null
      }
      return {
        id: term,
        text: term,
        newTag: true
      }
    }
  })
})
</script>

<template>
  <div>
    <label for="ecommerce-product-tags" class="form-label mb-1">Tags</label>
    <select
      id="ecommerce-product-tags"
      class="select2 form-control"
      ref="tagSelectRef"
      multiple="multiple"
      data-placeholder="Select or add tags"
    >
    </select>
  </div>
</template>

<style>
@import 'select2/dist/css/select2.css';

body .select2-container .select2-selection--multiple {
  height: auto;
}
body .select2-container--default .select2-selection--multiple .select2-selection__arrow {
  height: 36px;
  right: 7px;
}
</style>

