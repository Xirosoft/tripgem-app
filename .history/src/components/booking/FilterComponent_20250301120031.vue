<template>
  <div class="row pb-2 gap-3 gap-md-0">
    <div class="col-md-2 product_status"></div>
    <div class="col-md-2 product_location"></div>
    <div class="col-md-2 product_payment_method">
      <select
        class="form-select text-capitalize"
        v-model="selectedPaymentMethod"
        @change="onPaymentMethodChange"
      >
        <option value="">Payment Method</option>
        <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
      </select>
    </div>
    <div class="col-md-4 product_date_range">
      <DatePicker v-model="dateRange" range @change="onDateRangeChange" />
      <select class="form-select mt-2" v-model="presetDateRange" @change="onPresetDateRangeChange">
        <option value="">Select Date Range</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="lastWeek">Last Week</option>
        <option value="lastMonth">Last Month</option>
        <option value="thisMonth">This Month</option>
      </select>
    </div>
    <div class="col-md-2 d-flex align-items-center justify-content-md-end">
      <button class="dt-button add-new btn btn-primary" v-if="vCan" @click="$emit('add-booking')">
        <span>
          <i class="ti ti-plus me-0 me-sm-1 ti-xs"></i>
          <span class="d-none d-sm-inline-block">Add Booking</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any specific styles for the filter component here */
</style>
