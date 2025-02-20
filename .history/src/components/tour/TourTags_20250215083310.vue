<script setup>
import axios from 'axios'
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.css'
import { nextTick, onMounted, ref, watch } from 'vue'
import config from '../../config/config'

const props = defineProps({
  selectedTags: Array,
})

const tags = ref(props.selectedTags)

watch(
  () => props.selectedTags,
  (newVal) => {
    tags.value = newVal
    $('#tags-select').val(newVal).trigger('change')
  },
)

onMounted(() => {
  $('#tags-select').select2()
  $('#tags-select').val(tags.value).trigger('change')
})

const selectedTags1 = ref([]) // Holds selected tag IDs for first select
const selectedTags2 = ref([]) // Holds selected tag IDs for second select
const tagSelectRef1 = ref(null)
const tagSelectRef2 = ref(null)
const loadingTags = ref(false)

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

  // console.log('Initializing Select2...')

  if ($.fn.select2 && $(selectRef.value).data('select2')) {
    // console.log('Destroying previous Select2 instance...')
    $(selectRef.value).select2('destroy') // Destroy previous instance if exists
  }

  nextTick(() => {
    // console.log('Setting up Select2 with tags:', tags.value)
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
        // console.log('Tag selected:', data)
        if (data.newTag) {
          await addTag({ tag_name: data.text })
        }
        if (!selectedTags.value.includes(data.id)) {
          selectedTags.value.push(data.id) // Ensure it updates Vue state
        }
      })

      // Handle unselecting tags
      .on('select2:unselect', (e) => {
        const data = e.params.data
        // console.log('Tag unselected:', data)
        selectedTags.value = selectedTags.value.filter((id) => id !== data.id)
      })
  })
}

// Run on mount
onMounted(async () => {
  // console.log('Fetching tags...')
  await fetchTags()
  nextTick(() => {
    // console.log('Tags fetched:', tags.value)
    initializeSelect2(tagSelectRef1, selectedTags1)
    // initializeSelect2(tagSelectRef2, selectedTags2)
  })
})

// Watch for changes in tags and reinitialize Select2
watch(tags, () => {
  // console.log('Tags updated:', tags.value)
  nextTick(() => {
    initializeSelect2(tagSelectRef1, selectedTags1)
    // initializeSelect2(tagSelectRef2, selectedTags2)
  })
})

// Watch for changes in selectedTags and update Select2 UI
watch(selectedTags1, () => {
  console.log('Selected tags updated for first select:', selectedTags1.value)
  $(tagSelectRef1.value).val(selectedTags1.value).trigger('change')
})

watch(selectedTags2, () => {
  console.log('Selected tags updated for second select:', selectedTags2.value)
  $(tagSelectRef2.value).val(selectedTags2.value).trigger('change')
})
</script>

<template>
  <div>
    <label for="tags-select">Tags</label>
    <select id="tags-select" class="select2 form-select" multiple v-model="tags">
      <!-- Options for tags -->
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
