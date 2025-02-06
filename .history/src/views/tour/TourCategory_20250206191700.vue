<script>
import $ from 'jquery'
import 'select2'
import 'select2/dist/css/select2.min.css'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useCategoryStore } from '../../stores/tour/TourCategory.js'

export default defineComponent({
  name: 'TourCategory',
  setup() {
    const toast = useToast()
    const categoryStore = useCategoryStore()
    const {
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
    } = categoryStore

    const isEditing = ref(false)
    const currentCategoryId = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const sortKey = ref('category_id')
    const sortOrder = ref('asc')

    onMounted(() => {
      fetchCategories()
      $('#parentId').select2({
        placeholder: 'Select Parent Category',
        allowClear: true,
      })
    })

    const handleEditCategory = async (categoryId) => {
      const category = await getCategory(categoryId)
      if (category) {
        name.value = category.category_name
        categorySlug.value = category.category_slug
        description.value = category.description
        parentId.value = category.parent_id
        isEditing.value = true
        currentCategoryId.value = categoryId
        $('#parentId').val(category.parent_id).trigger('change')
      }
    }

    const handleDeleteCategory = (categoryId) => {
      if (confirm('Are you sure you want to delete this category?')) {
        deleteCategory(categoryId)
      }
    }

    const handleSubmit = async () => {
      if (isEditing.value) {
        await editCategory(currentCategoryId.value)
        isEditing.value = false
        currentCategoryId.value = null
      } else {
        await addCategory()
      }
      name.value = ''
      categorySlug.value = ''
      description.value = ''
      parentId.value = null
      $('#parentId').val(null).trigger('change')
      fetchCategories() // Ensure the data table updates in real-time
    }

    const sortedCategories = computed(() => {
      return [...categories.value].sort((a, b) => {
        if (sortOrder.value === 'asc') {
          return a[sortKey.value] > b[sortKey.value] ? 1 : -1
        } else {
          return a[sortKey.value] < b[sortKey.value] ? 1 : -1
        }
      })
    })

    const paginatedCategories = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return sortedCategories.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(categories.value.length / itemsPerPage.value)
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

    const parentCategories = computed(() => {
      return categories.value.filter((category) => category.parent_id === null)
    })

    return {
      categories,
      name,
      categorySlug,
      description,
      parentId,
      addCategory,
      toast,
      selectedCategories,
      toggleSelectAll,
      toggleSelectCategory,
      handleEditCategory,
      handleDeleteCategory,
      handleSubmit,
      isEditing,
      currentPage,
      itemsPerPage,
      totalPages,
      changePage,
      paginatedCategories,
      changeSort,
      sortKey,
      sortOrder,
      parentCategories,
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
                  <th @click="changeSort('category_id')" class="sortable">
                    ID
                    <span
                      v-if="sortKey === 'category_id'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th @click="changeSort('category_name')" class="sortable">
                    Name
                    <span
                      v-if="sortKey === 'category_name'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th @click="changeSort('category_slug')" class="sortable">
                    Slug
                    <span
                      v-if="sortKey === 'category_slug'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th @click="changeSort('description')" class="sortable">
                    Description
                    <span
                      v-if="sortKey === 'description'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th @click="changeSort('parent_id')" class="sortable">
                    Parent ID
                    <span
                      v-if="sortKey === 'parent_id'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="category in paginatedCategories" :key="category.category_id">
                  <td>
                    <input
                      type="checkbox"
                      :value="category.category_id"
                      v-model="selectedCategories"
                      @change="toggleSelectCategory(category.category_id)"
                    />
                  </td>
                  <td>{{ category.category_id }}</td>
                  <td>{{ category.category_name }}</td>
                  <td>{{ category.category_slug }}</td>
                  <td>{{ category.description }}</td>
                  <td>{{ category.parent_id }}</td>
                  <td>
                    <button
                      @click="handleEditCategory(category.category_id)"
                      class="btn btn-primary btn-sm waves-effect waves-light me-1"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDeleteCategory(category.category_id)"
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
          <h5 class="card-header">{{ isEditing ? 'Edit Category' : 'Add new Category' }}</h5>
          <div class="card-body">
            <div>
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="name"
                placeholder="Category Name"
              />
            </div>
            <div>
              <label for="categorySlug" class="form-label">Slug</label>
              <input
                type="text"
                class="form-control"
                id="categorySlug"
                v-model="categorySlug"
                placeholder="Category Slug"
              />
            </div>
            <div>
              <label for="description" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="description"
                v-model="description"
                placeholder="Category Description"
              ></textarea>
            </div>
            <div>
              <label for="parentId" class="form-label">Parent Category</label>
              <select class="form-control" id="parentId" v-model="parentId">
                <option value="">Select Parent Category</option>
                <option
                  v-for="category in parentCategories"
                  :key="category.category_id"
                  :value="category.category_id"
                >
                  {{ category.category_name }}
                </option>
              </select>
            </div>
            <br />
            <button @click="handleSubmit" class="btn btn-primary me-4 waves-effect waves-light">
              {{ isEditing ? 'Update Category' : 'Add New Category' }}
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

.sortable {
  cursor: pointer;
}

.sort-asc::after {
  content: '▲';
  margin-left: 5px;
}

.sort-desc::after {
  content: '▼';
  margin-left: 5px;
}
</style>
