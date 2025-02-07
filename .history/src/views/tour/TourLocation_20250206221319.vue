<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useLocationStore } from '../../stores/tour/TourLocation.js'

export default defineComponent({
  name: 'TourLocation',
  setup() {
    const toast = useToast()
    const locationStore = useLocationStore()
    const {
      locations,
      name,
      slug,
      address,
      fetchLocations,
      addLocation,
      selectedLocations,
      toggleSelectAll,
      toggleSelectLocation,
      editLocation,
      deleteLocation,
      getLocation,
    } = locationStore

    const isEditing = ref(false)
    const currentLocationId = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const sortKey = ref('location_id')
    const sortOrder = ref('asc')

    onMounted(() => {
      fetchLocations()
    })

    const handleEditLocation = async (locationId) => {
      const location = await getLocation(locationId)
      if (location) {
        name.value = location.name
        slug.value = location.slug
        address.value = location.address
        isEditing.value = true
        currentLocationId.value = locationId
      }
    }

    const handleDeleteLocation = (locationId) => {
      if (confirm('Are you sure you want to delete this location?')) {
        deleteLocation(locationId)
      }
    }

    const handleSubmit = async () => {
      if (isEditing.value) {
        await editLocation(currentLocationId.value)
        isEditing.value = false
        currentLocationId.value = null
      } else {
        await addLocation()
      }
      name.value = ''
      slug.value = ''
      address.value = ''
      fetchLocations() // Ensure the data table updates in real-time
    }

    const sortedLocations = computed(() => {
      return [...locations.value].sort((a, b) => {
        if (sortOrder.value === 'asc') {
          return a[sortKey.value] > b[sortKey.value] ? 1 : -1
        } else {
          return a[sortKey.value] < b[sortKey.value] ? 1 : -1
        }
      })
    })

    const paginatedLocations = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return sortedLocations.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(locations.value.length / itemsPerPage.value)
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
      locations,
      name,
      slug,
      address,
      addLocation,
      toast,
      selectedLocations,
      toggleSelectAll,
      toggleSelectLocation,
      handleEditLocation,
      handleDeleteLocation,
      handleSubmit,
      isEditing,
      currentPage,
      itemsPerPage,
      totalPages,
      changePage,
      paginatedLocations,
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
                  <th @click="changeSort('location_id')" class="sortable">
                    ID
                    <span
                      v-if="sortKey === 'location_id'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th @click="changeSort('name')" class="sortable">
                    Name
                    <span
                      v-if="sortKey === 'name'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th @click="changeSort('slug')" class="sortable">
                    Slug
                    <span
                      v-if="sortKey === 'slug'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th @click="changeSort('address')" class="sortable">
                    Address
                    <span
                      v-if="sortKey === 'address'"
                      :class="sortOrder === 'asc' ? 'sort-asc' : 'sort-desc'"
                    ></span>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="location in paginatedLocations" :key="location.location_id">
                  <td>
                    <input
                      type="checkbox"
                      :value="location.location_id"
                      v-model="selectedLocations"
                      @change="toggleSelectLocation(location.location_id)"
                    />
                  </td>
                  <td>{{ location.location_id }}</td>
                  <td>{{ location.name }}</td>
                  <td>{{ location.slug }}</td>
                  <td>{{ location.address }}</td>
                  <td>
                    <button
                      @click="handleEditLocation(location.location_id)"
                      class="btn btn-primary btn-sm waves-effect waves-light me-1"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDeleteLocation(location.location_id)"
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
          <h5 class="card-header">{{ isEditing ? 'Edit Location' : 'Add new Location' }}</h5>
          <div class="card-body">
            <div>
              <label for="name" class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="name"
                placeholder="Location Name"
              />
            </div>
            <div>
              <label for="slug" class="form-label">Slug</label>
              <input
                type="text"
                class="form-control"
                id="slug"
                v-model="slug"
                placeholder="Location Slug"
              />
            </div>
            <div>
              <label for="address" class="form-label">Address</label>
              <textarea
                class="form-control"
                id="address"
                v-model="address"
                placeholder="Location Address"
              ></textarea>
            </div>
            <br />
            <button @click="handleSubmit" class="btn btn-primary me-4 waves-effect waves-light">
              {{ isEditing ? 'Update Location' : 'Add New Location' }}
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
