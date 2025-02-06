<script>
import { defineComponent, onMounted } from 'vue'
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
    } = rolesListStore

    onMounted(() => {
      fetchTags()
    })

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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-5">
        <div class="card">
          <h5 class="card-header">Add new Tag</h5>
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
            <button @click="addTag" class="btn btn-primary me-4 waves-effect waves-light">
              Add New Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
