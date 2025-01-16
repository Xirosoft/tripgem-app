<script>
import axios from 'axios'
import { defineStore } from 'pinia'
import config from '../../config/config'
import { usePermissionStore } from '../../stores/permission/PermissionStore.js'

const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: [],
  }),
  actions: {
    async fetchPermissions() {
      try {
        const response = await axios.get(`${config.apiUrl}/permissions/view`, {
          headers: config.getHeaders(),
        })
        this.permissions = response.data.data
      } catch (error) {
        console.error('Error fetching permissions:', error)
      }
    },
  },
})

export default {
  name: 'AddPermissionModal',
  data() {
    return {
      permissionName: '',
      permissionDescription: '',
      isCorePermission: false,
    }
  },
  created() {
    // this.fetchPermissions()
  },
  methods: {
    async addPermission() {
      const payload = {
        permission_name: this.permissionName,
        description: this.permissionDescription,
        core: this.isCorePermission,
      }
      try {
        const response = await axios.post(`${config.apiUrl}/permissions/add`, payload, {
          headers: config.getHeaders(),
        })

        if (response.data.success) {
          // Handle success (e.g., close modal, show success message)
        } else {
          // Handle error (e.g., show error message)
        }
      } catch (error) {
        // Handle network error
        console.error('Error adding permission:', error)
      }
    },
  },
}
</script>

<template>
  <div class="modal fade" id="addPermissionModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-simple">
      <div class="modal-content">
        <div class="modal-body">
          <button
            type="button"
            class="btn-close btn-pinned"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
          <div class="text-center mb-6">
            <h4 class="mb-2">Add New Permission</h4>
            <p>Permissions you may use and assign to your users.</p>
          </div>
          <form id="addPermissionForm" class="row" @submit.prevent="addPermission">
            <div class="col-12 mb-4">
              <label class="form-label" for="modalPermissionName">Permission Name</label>
              <input
                type="text"
                id="modalPermissionName"
                name="modalPermissionName"
                class="form-control"
                v-model="permissionName"
                placeholder="Permission Name"
                autofocus
              />
            </div>
            <div class="col-12 mb-4">
              <label class="form-label" for="modalPermissionDescription">Description</label>
              <textarea
                id="modalPermissionDescription"
                name="modalPermissionDescription"
                class="form-control"
                v-model="permissionDescription"
                placeholder="Permission Description"
                rows="3"
              ></textarea>
            </div>
            <div class="col-12 mb-2">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="corePermission"
                  v-model="isCorePermission"
                />
                <label class="form-check-label" for="corePermission">
                  Set as core permission
                </label>
              </div>
            </div>
            <div class="col-12 text-center demo-vertical-spacing">
              <button type="submit" class="btn btn-primary me-4">Create Permission</button>
              <button
                type="reset"
                class="btn btn-label-secondary"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
