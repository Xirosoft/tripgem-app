<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
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
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const sortKey = ref('tag_id')
    const sortOrder = ref('asc')

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

    const sortedTags = computed(() => {
      return [...tags.value].sort((a, b) => {
        if (sortOrder.value === 'asc') {
          return a[sortKey.value] > b[sortKey.value] ? 1 : -1
        } else {
          return a[sortKey.value] < b[sortKey.value] ? 1 : -1
        }
      })
    })

    const paginatedTags = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return sortedTags.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(tags.value.length / itemsPerPage.value)
    })

    const changePage = (page) => {
      currentPage.value = page
    }

    const changeSort = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
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
      currentPage,
      itemsPerPage,
      totalPages,
      changePage,
      paginatedTags,
      changeSort,
      sortKey,
      sortOrder,
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
                  <th @click="changeSort('tag_id')">ID</th>
                  <th @click="changeSort('tag_name')">Name</th>
                  <th @click="changeSort('tag_slug')">Slug</th>
                  <th @click="changeSort('description')">Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tag in paginatedTags" :key="tag.tag_id">
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
            <div class="dt-paging">
              <nav aria-label="pagination">
                <ul class="pagination">
                  <li class="dt-paging-button page-item" :class="{ disabled: currentPage === 1 }">
                    <button
                      class="page-link first"
                      role="link"
                      type="button"
                      aria-controls="DataTables_Table_0"
                      aria-disabled="currentPage === 1"
                      aria-label="First"
                      @click="changePage(1)"
                    >
                      «
                    </button>
                  </li>
                  <li class="dt-paging-button page-item" :class="{ disabled: currentPage === 1 }">
                    <button
                      class="page-link previous"
                      role="link"
                      type="button"
                      aria-controls="DataTables_Table_0"
                      aria-disabled="currentPage === 1"
                      aria-label="Previous"
                      @click="changePage(currentPage - 1)"
                    >
                      ‹
                    </button>
                  </li>
                  <li
                    v-for="page in totalPages"
                    :key="page"
                    class="dt-paging-button page-item"
                    :class="{ active: currentPage === page }"
                  >
                    <button
                      class="page-link"
                      role="link"
                      type="button"
                      aria-controls="DataTables_Table_0"
                      aria-current="currentPage === page"
                      @click="changePage(page)"
                    >
                      {{ page }}
                    </button>
                  </li>
                  <li
                    class="dt-paging-button page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <button
                      class="page-link next"
                      role="link"
                      type="button"
                      aria-controls="DataTables_Table_0"
                      aria-disabled="currentPage === totalPages"
                      aria-label="Next"
                      @click="changePage(currentPage + 1)"
                    >
                      ›
                    </button>
                  </li>
                  <li
                    class="dt-paging-button page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <button
                      class="page-link last"
                      role="link"
                      type="button"
                      aria-controls="DataTables_Table_0"
                      aria-disabled="currentPage === totalPages"
                      aria-label="Last"
                      @click="changePage(totalPages)"
                    >
                      »
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
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

<style lang="postcss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination .btn {
  margin: 0 2px;
}

.pagination .btn.active {
  background-color: #007bff;
  color: white;
}

.dt-paging {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.dt-paging .pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.dt-paging .page-item {
  margin: 0 2px;
}

.dt-paging .page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.6;
}

.dt-paging .page-item.active .page-link {
  background-color: #007bff;
  color: white;
}

.dt-paging .page-link {
  border: 1px solid #dee2e6;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}
</style>
