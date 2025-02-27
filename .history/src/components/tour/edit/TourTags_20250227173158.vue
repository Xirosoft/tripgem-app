<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import config from '../../../config/config'

const emit = defineEmits(['tags-change'])
const tags = ref([]) // Holds all available tags
const selectedTags1 = ref([]) // Holds selected tag IDs for first select
const tagSelectRef1 = ref(null)
const loadingTags = ref(false)

const props = defineProps({
  selectedTags: Array,
})

// Fetch existing tags from the API
const fetchTags = async () => {
  loadingTags.value = true
  try {
    const response = await axios.get(`${config.apiUrl}/tour/tags/view`, {
      headers: config.getHeaders(),
    })
    tags.value = response.data.map((tag) => ({
      id: tag.tag_id.toString(), // Ensure id is a string
      text: tag.tag_name,
    }))
  } catch (error) {
    console.error('Error fetching tags:', error)
  } finally {
    loadingTags.value = false
  }
}

// Add a new tag to the API
const addTag = async (tag) => {
  try {
    const response = await axios.post(
      `${config.apiUrl}/tour/tag/add`,
      {
        name: tag.tag_name,
        slug: tag.tag_name.toLowerCase().replace(/\s+/g, '-'),
        description: 'Details description',
      },
      {
        headers: config.getHeaders(),
      },
    )
    console.log('Tag added:', response.data)
    await fetchTags()
  } catch (error) {
    console.error('Error adding tag:', error)
  }
}

// Initialize Select2 for a given ref and selectedTags
const initializeSelect2 = (selectRef, selectedTags) => {
  if (!selectRef.value) return

  if ($.fn.select2 && $(selectRef.value).data('select2')) {
    $(selectRef.value).select2('destroy') // Destroy previous instance if exists
  }

  nextTick(() => {
    $(selectRef.value)
      .select2({
        tags: true,
        multiple: true,
        data: tags.value, // Provide preloaded tags
        createTag: (params) => {
          const term = $.trim(params.term)
          if (term === '') return null
          return { id: term, text: term, newTag: true }
        },
      })
      .val(selectedTags.value) // Ensure selected values are set
      .trigger('change')

      // Handle selecting tags
      .on('select2:select', async (e) => {
        const data = e.params.data
        if (data.newTag) {
          await addTag({ tag_name: data.text })
        }
        if (!selectedTags.value.includes(data.id)) {
          selectedTags.value.push(data.id) // Ensure it updates Vue state
        }
        emitTagsChange()
      })

      // Handle unselecting tags
      .on('select2:unselect', (e) => {
        const data = e.params.data
        // selectedTags.value = selectedTags.value.filter((id) => id !== data.id)
        emitTagsChange()
      })
  })
}

const emitTagsChange = () => {
  const selectedTagsData = selectedTags1.value.map((tagId) => {
    const tag = tags.value.find((t) => t.id === tagId)
    return { id: tag.id, name: tag.text }
  })
  emit('tags-change', selectedTagsData)
}

// Run on mount
onMounted(async () => {
  await fetchTags()
  nextTick(() => {
    initializeSelect2(tagSelectRef1, selectedTags1)
  })
})

// Watch for changes in tags and reinitialize Select2
watch(tags, () => {
  nextTick(() => {
    initializeSelect2(tagSelectRef1, selectedTags1)
  })
})

watch(
  () => props.selectedTags,
  (newTags) => {
    // console.log('newTags:', newTags)

    if (newTags) {
      selectedTags1.value = newTags.map((tag) => tag.id)
      nextTick(() => {
        $(tagSelectRef1.value).val(selectedTags1.value).trigger('change')
      })
    }
  },
)
</script>

<template>
  <div>
    <label for="ecommerce-product-tags-1" class="form-label mb-1">Tags</label>
    <select
      id="ecommerce-product-tags-1"
      class="select2 form-control"
      ref="tagSelectRef1"
      multiple="multiple"
      data-placeholder="Select or add tags"
    ></select>
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
