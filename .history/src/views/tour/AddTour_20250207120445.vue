<script setup>
import { onMounted } from 'vue'
import { initializeEcommerceAddProduct } from '../../stores/tour/initializeEcommerceAddProduct'

onMounted(() => {
  initializeEcommerceAddProduct()
})
</script>

<template>
  <div class="app-ecommerce">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4"
    >
      <div class="d-flex flex-column justify-content-center">
        <h4 class="mb-1">Add a new Tour</h4>
        <p class="mb-0">Create your tour listing</p>
      </div>
      <div class="d-flex align-content-center flex-wrap gap-4">
        <div class="d-flex gap-4">
          <button class="btn btn-label-secondary">Discard</button>
          <button class="btn btn-label-primary">Save draft</button>
        </div>
        <button type="submit" class="btn btn-primary">Publish Tour</button>
      </div>
    </div>

    <div class="row">
      <!-- First column-->
      <div class="col-12 col-lg-8">
        <!-- Basic Information -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-tile mb-0">Tour Basic Information</h5>
          </div>
          <div class="card-body">
            <div class="mb-6">
              <label class="form-label" for="tour-name">Tour Name</label>
              <input
                type="text"
                class="form-control"
                id="tour-name"
                placeholder="Enter tour name"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="subheading">Subheading</label>
              <input
                type="text"
                class="form-control"
                id="subheading"
                placeholder="Enter subheading"
              />
            </div>
            <div class="mb-6">
              <label class="form-label">Description</label>
              <div class="form-control p-0">
                <div class="comment-editor border-0 pb-6" id="tour-description"></div>
              </div>
            </div>
            <div class="mb-6">
              <label class="form-label">Itinerary</label>
              <div class="form-control p-0">
                <div class="comment-editor border-0 pb-6" id="tour-itinerary"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tour Details -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-tile mb-0">Tour Details</h5>
          </div>
          <div class="card-body">
            <div class="row mb-6">
              <div class="col-6">
                <label class="form-label">Start Time</label>
                <input type="time" class="form-control" id="tour-start-time" />
              </div>
              <div class="col-6">
                <label class="form-label">End Time</label>
                <input type="time" class="form-control" id="tour-end-time" />
              </div>
            </div>
            <div class="row mb-6">
              <div class="col-6">
                <label class="form-label">Total Seats</label>
                <input type="number" class="form-control" id="total-seat" />
              </div>
              <div class="col-6">
                <label class="form-label">Available Seats</label>
                <input type="number" class="form-control" id="available-seat" />
              </div>
            </div>
            <div class="row mb-6">
              <div class="col-6">
                <label class="form-label">Minimum Age</label>
                <input type="number" class="form-control" id="min-age" />
              </div>
              <div class="col-6">
                <label class="form-label">Maximum Age</label>
                <input type="number" class="form-control" id="max-age" />
              </div>
            </div>
          </div>
        </div>

        <!-- Media Upload -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Tour Media</h5>
          </div>
          <div class="card-body">
            <form action="/upload" class="dropzone needsclick" id="dropzone-images">
              <div class="dz-message needsclick">
                <p class="h4">Drop images here or click to upload</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Second column -->
      <div class="col-12 col-lg-4">
        <!-- Pricing Card -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Tour Pricing</h5>
          </div>
          <div class="card-body">
            <div class="mb-6">
              <label class="form-label">Regular Price (Adult)</label>
              <input type="number" class="form-control" id="regular-price-adult" />
            </div>
            <div class="mb-6">
              <label class="form-label">Net Price (Adult)</label>
              <input type="number" class="form-control" id="net-price-adult" />
            </div>
            <div class="mb-6">
              <label class="form-label">Regular Price (Child)</label>
              <input type="number" class="form-control" id="regular-price-child" />
            </div>
            <div class="mb-6">
              <label class="form-label">Net Price (Child)</label>
              <input type="number" class="form-control" id="net-price-child" />
            </div>
            <div class="mb-6">
              <label class="form-label">Discount Percentage</label>
              <input type="number" class="form-control" id="discount-percentage" />
            </div>
            <div class="mb-6">
              <label class="form-label">Currency</label>
              <select class="form-select" id="currency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="THB">THB</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Additional Information</h5>
          </div>
          <div class="card-body">
            <div class="mb-6">
              <label class="form-label">Transport Types</label>
              <input id="transport-types" class="form-control" />
            </div>
            <div class="mb-6">
              <label class="form-label">Languages Supported</label>
              <input id="languages-supported" class="form-control" />
            </div>
            <div class="mb-6">
              <label class="form-label">Highlights</label>
              <input id="highlights" class="form-control" />
            </div>
            <div class="mb-6">
              <label class="form-label">Cancellation Policy</label>
              <textarea class="form-control" id="cancellation-policy"></textarea>
            </div>
            <div class="mb-6">
              <label class="form-label">Tour Type</label>
              <select class="form-select" id="tour-type">
                <option value="group">Group</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div class="mb-6">
              <label class="form-label">Status</label>
              <select class="form-select" id="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'dropzone/dist/dropzone.css';
@import '@yaireo/tagify/dist/tagify.css';
@import 'quill/dist/quill.snow.css';
@import 'select2/dist/css/select2.css';
@import 'flatpickr/dist/flatpickr.css';
.select2-container .select2-selection--single {
  height: auto;
}
.select2-container--default .select2-selection--single .select2-selection__arrow {
  height: 36px;
  right: 7px;
}
</style>
