<script setup>
import $ from 'jquery'
import { onMounted } from 'vue'
import MerchantUsers from '../../components/tour/MerchantUsers.vue'
import TourCategory from '../../components/tour/TourCategory.vue'
import TourLocation from '../../components/tour/TourLocation.vue'
import TourTags from '../../components/tour/TourTags.vue'
import { initializeEcommerceAddProduct } from '../../stores/tour/initializeEcommerceAddProduct'
onMounted(() => {
  initializeEcommerceAddProduct()
  $('.select2').select2() // Initialize select2 for all elements with class 'select2'
})
</script>

<template>
  <div class="app-ecommerce">
    <!-- Add Product -->
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-6 row-gap-4"
    >
      <div class="d-flex flex-column justify-content-center">
        <h4 class="mb-1">Add a new Tour</h4>
        <p class="mb-0">Orders placed across your store</p>
      </div>
      <div class="d-flex align-content-center flex-wrap gap-4">
        <div class="d-flex gap-4">
          <button class="btn btn-label-secondary">View Tour</button>
          <button class="btn btn-label-primary">Save draft</button>
        </div>
        <button type="submit" class="btn btn-primary">Publish Tour</button>
      </div>
    </div>

    <div class="row">
      <!-- First column-->
      <div class="col-12 col-lg-8">
        <input type="hidden" name="merchant_id" value="" />
        <input type="hidden" name="user_id" value="" />
        <!-- Product Information -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-tile mb-0">Tour Listing information</h5>
          </div>
          <div class="card-body">
            <div class="mb-6">
              <label class="form-label" for="tour-title">Title</label>
              <input
                type="text"
                class="form-control"
                id="tour-title"
                placeholder="Product title"
                name="productTitle"
                aria-label="Tour title"
              />
            </div>
            <div class="mb-6">
              <label class="form-label" for="tour-title">Sub Title</label>
              <input
                type="text"
                class="form-control"
                id="tour-title"
                placeholder="Sub title"
                name="productTitle"
                aria-label="Tour title"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="mb-1">Description (Optional)</label>
              <div class="form-control p-0">
                <div class="description-toolbar border-0 border-bottom">
                  <div class="d-flex justify-content-start">
                    <span class="ql-formats me-0">
                      <button class="ql-bold"></button>
                      <button class="ql-italic"></button>
                      <button class="ql-underline"></button>
                      <button class="ql-list" value="ordered"></button>
                      <button class="ql-list" value="bullet"></button>
                      <button class="ql-link"></button>
                      <button class="ql-image"></button>
                    </span>
                  </div>
                </div>
                <div
                  class="tour-description-editor border-0 pb-6"
                  id="tour-category-description"
                ></div>
              </div>
            </div>
            <div class="mt-5">
              <label class="mb-1">Itinerary (Optional)</label>
              <div class="form-control p-0">
                <div class="itinerary-toolbar border-0 border-bottom">
                  <div class="d-flex justify-content-start">
                    <span class="ql-formats me-0">
                      <button class="ql-bold"></button>
                      <button class="ql-italic"></button>
                      <button class="ql-underline"></button>
                      <button class="ql-list" value="ordered"></button>
                      <button class="ql-list" value="bullet"></button>
                      <button class="ql-link"></button>
                      <button class="ql-image"></button>
                    </span>
                  </div>
                </div>
                <div class="tour-itinerary border-0 pb-6" id="tour-itinerary"></div>
              </div>
            </div>
            <div class="mb-6 mt-6">
              <label class="form-label" for="tour-title">Highlights</label>
              <textarea
                type="text"
                class="form-control"
                id="tour-title"
                placeholder="Sub title"
                name="productTitle"
                aria-label="Tour title"
              ></textarea>
            </div>
            <div class="mb-6 mt-6">
              <label class="form-label" for="tour-title">Cancellation Policy</label>
              <textarea
                type="text"
                class="form-control"
                id="tour-title"
                placeholder="Sub title"
                name="productTitle"
                aria-label="Tour title"
              ></textarea>
            </div>
          </div>
        </div>
        <!-- /Product Information -->

        <!-- Price -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Price Section</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Navigation -->
              <div class="col-12 col-md-4 col-xl-5 col-xxl-4 mx-auto card-separator">
                <div class="d-flex justify-content-between flex-column mb-4 mb-md-0 pe-md-4">
                  <div class="nav-align-left">
                    <ul class="nav nav-pills flex-column w-100">
                      <li class="nav-item">
                        <button
                          class="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#AdultPrice"
                        >
                          <i class="ti ti-box ti-sm me-1_5"></i>
                          <span class="align-middle">Adult Price</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button
                          class="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#tour_end_time"
                        >
                          <i class="ti ti-car ti-sm me-1_5"></i>
                          <span class="align-middle">Child Price</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#age_rules">
                          <i class="ti ti-car ti-sm me-1_5"></i>
                          <span class="align-middle">Age Rules</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- /Navigation -->
              <!-- Options -->
              <div class="col-12 col-md-8 col-xl-7 col-xxl-8 pt-6 pt-md-0">
                <div class="tab-content p-0 ps-md-4">
                  <!-- AdultPrice Tab -->
                  <div class="tab-pane fade show active" id="AdultPrice" role="tabpanel">
                    <h6 class="text-body">Adult Price</h6>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="adult-regular-price">Regular Price</label>
                      <input
                        type="number"
                        class="form-control"
                        id="adult-regular-price"
                        placeholder="Regular Price"
                        name="adultRegularPrice"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="adult-net-price">Net Price</label>
                      <input
                        type="number"
                        class="form-control"
                        id="adult-net-price"
                        placeholder="Net Price"
                        name="adultNetPrice"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label" for="adult-discounted-price"
                        >Discounted Price</label
                      >
                      <input
                        type="number"
                        class="form-control"
                        id="adult-discounted-price"
                        placeholder="Discounted Price"
                        name="adultDiscountedPrice"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <!-- Child Price Tab -->
                  <div class="tab-pane fade" id="tour_end_time" role="tabpanel">
                    <h6 class="mb-3 text-body">Child Price</h6>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="child-regular-price">Regular Price</label>
                      <input
                        type="number"
                        class="form-control"
                        id="child-regular-price"
                        placeholder="Regular Price"
                        name="childRegularPrice"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="child-net-price">Net Price</label>
                      <input
                        type="number"
                        class="form-control"
                        id="child-net-price"
                        placeholder="Net Price"
                        name="childNetPrice"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="col-12">
                      <label class="form-label" for="child-discounted-price"
                        >Discounted Price</label
                      >
                      <input
                        type="number"
                        class="form-control"
                        id="child-discounted-price"
                        placeholder="Discounted Price"
                        name="childDiscountedPrice"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div class="tab-pane fade" id="age_rules" role="tabpanel">
                    <h6 class="mb-3 text-body">Age Policy</h6>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="child-regular-price">Minimum Age</label>
                      <input
                        type="number"
                        class="form-control"
                        id="child-regular-price"
                        placeholder="Regular Price"
                        name="childRegularPrice"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label" for="child-net-price">Max Age</label>
                      <input
                        type="number"
                        class="form-control"
                        id="child-net-price"
                        placeholder="Net Price"
                        name="childNetPrice"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- /Options-->
            </div>
          </div>
        </div>
        <!-- /Price -->
        <!-- Gellary -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Gellary Section</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Navigation -->
              <div class="col-12 col-md-4 col-xl-5 col-xxl-4 mx-auto card-separator">
                <div class="d-flex justify-content-between flex-column mb-4 mb-md-0 pe-md-4">
                  <div class="nav-align-left">
                    <ul class="nav nav-pills flex-column w-100">
                      <li class="nav-item">
                        <button
                          class="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#photoGallery"
                        >
                          <i class="ti ti-box ti-sm me-1_5"></i>
                          <span class="align-middle">Photos</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button
                          class="nav-link"
                          data-bs-toggle="tab"
                          data-bs-target="#videoGallery"
                        >
                          <i class="ti ti-car ti-sm me-1_5"></i>
                          <span class="align-middle">Videos</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- /Navigation -->
              <!-- Options -->
              <div class="col-12 col-md-8 col-xl-7 col-xxl-8 pt-6 pt-md-0">
                <div class="tab-content p-0 ps-md-4">
                  <!-- photoGallery Tab -->
                  <div class="tab-pane fade show active" id="photoGallery" role="tabpanel">
                    <h6 class="text-body">You Can Upload upload multiple Photos</h6>
                    <div class="card mb-6">
                      <div class="card-body">
                        <form action="/upload" class="dropzone needsclick p-0" id="image_gallery">
                          <div class="dz-message needsclick">
                            <p class="h4 needsclick pt-3 mb-2">Drag and drop your image here</p>
                            <p class="h6 text-muted d-block fw-normal mb-2">or</p>
                            <span
                              class="note needsclick btn btn-sm btn-label-primary"
                              id="btnBrowse"
                              >Browse images</span
                            >
                          </div>
                          <div class="fallback">
                            <input name="image_gallery" type="file" />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <!-- Child Price Tab -->
                  <div class="tab-pane fade" id="videoGallery" role="tabpanel">
                    <h6 class="mb-3 text-body">You can multiple videos</h6>
                    <div class="card mb-6">
                      <div class="card-body">
                        <form action="/upload" class="dropzone needsclick p-0" id="dropzone-basic">
                          <div class="dz-message needsclick">
                            <p class="h4 needsclick pt-3 mb-2">Drag and drop your image here</p>
                            <p class="h6 text-muted d-block fw-normal mb-2">or</p>
                            <span
                              class="note needsclick btn btn-sm btn-label-primary"
                              id="btnBrowse"
                              >Browse videos</span
                            >
                          </div>
                          <div class="fallback">
                            <input name="video_gallery" type="file" />
                          </div>
                        </form>
                      </div>
                    </div>
                    <!-- /Media -->
                  </div>
                </div>
              </div>
              <!-- /Options-->
            </div>
          </div>
        </div>
        <!-- /Price -->
        <!-- Inventory -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Tour Schedule & Capacity</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <!-- Navigation -->
              <div class="col-12 col-md-4 col-xl-5 col-xxl-4 mx-auto card-separator">
                <div class="d-flex justify-content-between flex-column mb-4 mb-md-0 pe-md-4">
                  <div class="nav-align-left">
                    <ul class="nav nav-pills flex-column w-100">
                      <li class="nav-item">
                        <button
                          class="nav-link active"
                          data-bs-toggle="tab"
                          data-bs-target="#pickupTime"
                        >
                          <i class="ti ti-clock ti-sm me-1_5"></i>
                          <span class="align-middle">Pickup Time</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#dropoffTime">
                          <i class="ti ti-clock-off ti-sm me-1_5"></i>
                          <span class="align-middle">Drop-off Time</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tourDates">
                          <i class="ti ti-calendar ti-sm me-1_5"></i>
                          <span class="align-middle">Tour Dates</span>
                        </button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#capacity">
                          <i class="ti ti-users ti-sm me-1_5"></i>
                          <span class="align-middle">Tour Capacity</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- /Navigation -->
              <!-- Options -->
              <div class="col-12 col-md-8 col-xl-7 col-xxl-8 pt-6 pt-md-0">
                <div class="tab-content p-0 ps-md-4">
                  <!-- Pickup Time Tab -->
                  <div class="tab-pane fade show active" id="pickupTime" role="tabpanel">
                    <h6 class="text-body">Tour Pickup Time Range</h6>
                    <div class="mb-3">
                      <label class="form-label">From</label>
                      <input
                        type="time"
                        class="form-control"
                        id="pickupTimeStart"
                        name="pickupTimeStart"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">To</label>
                      <input
                        type="time"
                        class="form-control"
                        id="pickupTimeEnd"
                        name="pickupTimeEnd"
                      />
                    </div>
                  </div>
                  <!-- Drop-off Time Tab -->
                  <div class="tab-pane fade" id="dropoffTime" role="tabpanel">
                    <h6 class="mb-3 text-body">Tour Drop-off Time Range</h6>
                    <div class="mb-3">
                      <label class="form-label">From</label>
                      <input
                        type="time"
                        class="form-control"
                        id="dropoffTimeStart"
                        name="dropoffTimeStart"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">To</label>
                      <input
                        type="time"
                        class="form-control"
                        id="dropoffTimeEnd"
                        name="dropoffTimeEnd"
                      />
                    </div>
                  </div>
                  <!-- Tour Dates Tab -->
                  <div class="tab-pane fade" id="tourDates" role="tabpanel">
                    <h6 class="mb-3 text-body">Tour Availability</h6>
                    <div class="row mb-4">
                      <div class="col-md-6">
                        <label class="form-label">Start Date</label>
                        <input
                          type="date"
                          class="form-control"
                          id="tourStartDate"
                          name="tourStartDate"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">End Date</label>
                        <input
                          type="date"
                          class="form-control"
                          id="tourEndDate"
                          name="tourEndDate"
                        />
                      </div>
                    </div>
                    <div class="mb-4">
                      <label class="form-label">Operating Days</label>
                      <div class="d-flex flex-wrap gap-2">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="monday"
                            name="operatingDays"
                            value="monday"
                          />
                          <label class="form-check-label" for="monday">Monday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="tuesday"
                            name="operatingDays"
                            value="tuesday"
                          />
                          <label class="form-check-label" for="tuesday">Tuesday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="wednesday"
                            name="operatingDays"
                            value="wednesday"
                          />
                          <label class="form-check-label" for="wednesday">Wednesday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="thursday"
                            name="operatingDays"
                            value="thursday"
                          />
                          <label class="form-check-label" for="thursday">Thursday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="friday"
                            name="operatingDays"
                            value="friday"
                          />
                          <label class="form-check-label" for="friday">Friday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="saturday"
                            name="operatingDays"
                            value="saturday"
                          />
                          <label class="form-check-label" for="saturday">Saturday</label>
                        </div>
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="sunday"
                            name="operatingDays"
                            value="sunday"
                          />
                          <label class="form-check-label" for="sunday">Sunday</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Capacity Tab -->
                  <div class="tab-pane fade" id="capacity" role="tabpanel">
                    <h6 class="mb-3 text-body">Tour Capacity Settings</h6>
                    <div class="mb-3">
                      <p class="mb-0"><b>Total Seats</b></p>
                      <label class="form-label" for="maxCapacity">Maximum Capacity</label>
                      <input
                        type="number"
                        class="form-control"
                        id="maxCapacity"
                        name="maxCapacity"
                        min="1"
                        placeholder="Enter maximum number of guests"
                      />
                    </div>
                    <div class="mb-3">
                      <p class="mb-0"><b>Available Seats</b></p>
                      <label class="form-label" for="minGuests">Minimum Guests Required</label>
                      <input
                        type="number"
                        class="form-control"
                        id="minGuests"
                        name="minGuests"
                        min="1"
                        placeholder="Enter minimum guests required"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- /Options-->
            </div>
          </div>
        </div>
        <!-- /Tour Schedule & Capacity -->

        <!-- Variants -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Key Options</h5>
          </div>
          <div class="card-body">
            <form class="form-repeater">
              <div data-repeater-list="group-a">
                <div data-repeater-item>
                  <div class="row">
                    <div class="mb-6 col-4">
                      <label class="form-label" for="form-repeater-1-1">Options</label>
                      <input
                        type="text"
                        id="form-repeater-1-1"
                        class="form-control"
                        placeholder="Enter option"
                      />
                    </div>

                    <div class="mb-6 col-8">
                      <label class="form-label invisible" for="form-repeater-1-2"
                        >Not visible</label
                      >
                      <input
                        type="number"
                        id="form-repeater-1-2"
                        class="form-control"
                        placeholder="Enter size"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <button class="btn btn-primary" data-repeater-create>
                  <i class="ti ti-plus ti-xs me-2"></i>
                  Add another option
                </button>
              </div>
            </form>
          </div>
        </div>
        <!-- /Variants -->
      </div>
      <!-- Second column -->
      <div class="col-12 col-lg-4">
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Status </label>
          <select id="status-org" class="select2 form-select" data-placeholder="Published">
            <option value="Published">Published</option>
            <option value="Published" selected>Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Tour Type </label>
          <select id="tour-type" class="select2 form-select" data-placeholder="Select Tour Type">
            <option value="Group">Group</option>
            <option value="Private">Private</option>
            <option value="Adventure">Adventure</option>
            <option value="Luxury">Luxury</option>
            <option value="Cultural">Cultural</option>
            <option value="Beach">Beach</option>
            <option value="Eco">Eco</option>
          </select>
        </div>
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Transportation Type </label>
          <select
            id="transport-type"
            class="select2 form-select"
            data-placeholder="Select Transportation"
          >
            <option value="Car">Car</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Flight">Flight</option>
            <option value="Boat">Boat</option>
            <option value="Bicycle">Bicycle</option>
            <option value="Motorbike">Motorbike</option>
            <option value="Ferry">Ferry</option>
            <option value="Speedboat">Speedboat</option>
            <option value="Catamaran">Catamaran</option>
            <option value="Longtail Boat">Longtail Boat</option>
            <option value="Van">Van</option>
          </select>
        </div>
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Guide Language Support</label>
          <select
            id="language"
            class="select2 form-select"
            data-placeholder="Select Language"
            multiple
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Thai">Thai</option>
            <option value="Russian">Russian</option>
            <option value="Arabic">Arabic</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>
        <div class="mb-6 col ecommerce-select2-dropdown">
          <label class="form-label mb-1" for="status-org">Currency Support</label>
          <select
            id="currency"
            class="select2 form-select"
            data-placeholder="Select Currency"
            multiple
          >
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="THB">Thai Baht (THB)</option>
            <option value="AUD">Australian Dollar (AUD)</option>
            <option value="CAD">Canadian Dollar (CAD)</option>
            <option value="SGD">Singapore Dollar (SGD)</option>
            <option value="JPY">Japanese Yen (JPY)</option>
            <option value="CNY">Chinese Yuan (CNY)</option>
            <option value="INR">Indian Rupee (INR)</option>
            <option value="AED">UAE Dirham (AED)</option>
            <option value="CHF">Swiss Franc (CHF)</option>
            <option value="HKD">Hong Kong Dollar (HKD)</option>
            <option value="NZD">New Zealand Dollar (NZD)</option>
            <option value="KRW">South Korean Won (KRW)</option>
            <option value="BRL">Brazilian Real (BRL)</option>
            <option value="MXN">Mexican Peso (MXN)</option>
            <option value="ZAR">South African Rand (ZAR)</option>
            <option value="RUB">Russian Ruble (RUB)</option>
            <option value="SEK">Swedish Krona (SEK)</option>
            <option value="NOK">Norwegian Krone (NOK)</option>
            <option value="DKK">Danish Krone (DKK)</option>
            <option value="MYR">Malaysian Ringgit (MYR)</option>
            <option value="IDR">Indonesian Rupiah (IDR)</option>
            <option value="PHP">Philippine Peso (PHP)</option>
            <option value="VND">Vietnamese Dong (VND)</option>
            <option value="SAR">Saudi Riyal (SAR)</option>
            <option value="EGP">Egyptian Pound (EGP)</option>
            <option value="PLN">Polish Złoty (PLN)</option>
            <option value="TRY">Turkish Lira (TRY)</option>
            <option value="HUF">Hungarian Forint (HUF)</option>
            <option value="CZK">Czech Koruna (CZK)</option>
            <option value="TWD">Taiwan Dollar (TWD)</option>
            <option value="ARS">Argentine Peso (ARS)</option>
            <option value="COP">Colombian Peso (COP)</option>
            <option value="PKR">Pakistani Rupee (PKR)</option>
            <option value="BDT">Bangladeshi Taka (BDT)</option>
            <option value="LKR">Sri Lankan Rupee (LKR)</option>
            <option value="NGN">Nigerian Naira (NGN)</option>
            <option value="KES">Kenyan Shilling (KES)</option>
            <option value="GHS">Ghanaian Cedi (GHS)</option>
          </select>
        </div>

        <!-- Pricing Card -->
        <div class="card mb-6">
          <div class="card-body">
            <!-- Base Price -->
            <!-- Instock switch -->
            <div class="d-flex justify-content-between align-items-center pt-2">
              <span class="mb-0">Booking Availability</span>
              <div class="w-25 d-flex justify-content-end">
                <div class="form-check form-switch me-n3">
                  <input type="checkbox" class="form-check-input" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- /Pricing Card -->

        <!-- Organize Card -->
        <div class="card mb-6">
          <div class="card-header">
            <h5 class="card-title mb-0">Organize</h5>
          </div>
          <div class="card-body">
            <MerchantUsers />
            <!-- Merchants -->

            <TourLocation />
            <TourCategory />
            <TourTags />
          </div>
        </div>
        <!-- /Organize Card -->

        <!-- Media -->
        <div class="card mb-6">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0 card-title">Thumbnail</h5>
            <!-- <a href="javascript:void(0);" class="fw-medium">Add media from URL</a> -->
          </div>
          <div class="card-body">
            <form action="/upload" class="dropzone needsclick p-0" id="thumbnail">
              <div class="dz-message needsclick">
                <p class="h4 needsclick pt-3 mb-2">Drag and drop your image here</p>
                <p class="h6 text-muted d-block fw-normal mb-2">or</p>
                <span class="note needsclick btn btn-sm btn-label-primary" id="btnBrowse"
                  >Browse image</span
                >
              </div>
              <div class="fallback">
                <input name="thumbnail" type="file" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <!-- /Second column -->
    </div>
  </div>
</template>

<style>
@import 'dropzone/dist/dropzone.css';
@import '@yaireo/tagify/dist/tagify.css';
@import 'quill/dist/quill.snow.css';
@import 'select2/dist/css/select2.css';
@import 'flatpickr/dist/flatpickr.css';

body .select2-container .select2-selection--single {
  height: auto;
}
body .select2-container--default .select2-selection--single .select2-selection__arrow {
  height: 36px;
  right: 7px;
}
</style>
