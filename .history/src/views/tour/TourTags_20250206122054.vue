<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRolesListStore } from '../../stores/tour/TourTags.js'

export default defineComponent({
  name: 'TourTags',
  setup() {
    const toast = useToast()
    const rolesListStore = useRolesListStore()
    const {
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
      getTag,
    } = rolesListStore

    const isEditing = ref(false)
    const currentTagId = ref(null)

    onMounted(() => {
      fetchTags()
    })

    const handleEditTag = async (tagId) => {
      const tag = await getTag(tagId)
      if (tag) {
        name.value = tag.tag_name
        slug.value = tag.tag_slug
        description.value = tag.description
        isEditing.value = true
        currentTagId.value = tagId
      }
    }

    const handleDeleteTag = (tagId) => {
      if (confirm('Are you sure you want to delete this tag?')) {
        deleteTag(tagId)
      }
    }

    const handleSubmit = async () => {
      if (isEditing.value) {
        await editTag(currentTagId.value)
        isEditing.value = false
        currentTagId.value = null
      } else {
        await addTag()
      }
      name.value = ''
      slug.value = ''
      description.value = ''
      fetchTags() // Ensure the data table updates in real-time
    }

    return {
      tags,
      name,
      slug,
      description,
      addTag,
      toast,
      selectedTags,
      toggleSelectAll,
      toggleSelectTag,
      handleEditTag,
      handleDeleteTag,
      handleSubmit,
      isEditing,
    }
  },
})
</script>

<template>
  <div class="wrapper">
    <div class="row">
      <div class="col-md-7">
        <div class="card">
          <div class="card-datatable table-responsive pt-0">
            <table class="datatables-basic table">
              <thead>
                <tr>
                  <th><input type="checkbox" @change="toggleSelectAll($event)" /></th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tag in tags" :key="tag.tag_id">
                  <td>
                    <input
                      type="checkbox"
                      :value="tag.tag_id"
                      v-model="selectedTags"
                      @change="toggleSelectTag(tag.tag_id)"
                    />
                  </td>
                  <td>{{ tag.tag_id }}</td>
                  <td>{{ tag.tag_name }}</td>
                  <td>{{ tag.tag_slug }}</td>
                  <td>{{ tag.description }}</td>
                  <td>
                    <button
                      @click="handleEditTag(tag.tag_id)"
                      class="btn btn-primary btn-sm waves-effect waves-light me-1"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDeleteTag(tag.tag_id)"
                      class="btn btn-danger btn-sm waves-effect waves-light"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-5">
        <div class="card">
          <h5 class="card-header">{{ isEditing ? 'Edit Tag' : 'Add new Tag' }}</h5>
          <div class="card-body">
            <div>
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="name"
                placeholder="Tag Name"
              />
            </div>
            <div>
              <label for="slug" class="form-label">Slug</label>
              <input
                type="text"
                class="form-control"
                id="slug"
                v-model="slug"
                placeholder="Tag Slug"
              />
            </div>
            <div>
              <label for="description" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="description"
                v-model="description"
                placeholder="Tag Description"
              ></textarea>
            </div>
            <br />
            <button @click="handleSubmit" class="btn btn-primary me-4 waves-effect waves-light">
              {{ isEditing ? 'Update Tag' : 'Add New Tag' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
