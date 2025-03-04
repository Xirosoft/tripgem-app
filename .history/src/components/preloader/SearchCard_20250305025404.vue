<script>
export default {
  name: 'SearchCard',
}
</script>

<template>
  <div class="tg-preloader">
    <!-- Tour Card 1 -->
    <div class="tg-card">
      <div class="tg-image"></div>
      <div class="tg-content">
        <div class="tg-title"></div>
        <div class="tg-desc"></div>
        <div class="tg-details"></div>
      </div>
      <div class="tg-btn-group">
        <div class="tg-buttons"></div>
        <br />
        <div class="tg-buttons"></div>
      </div>
    </div>

    <!-- Tour Card 2 -->
    <div class="tg-card">
      <div class="tg-image"></div>
      <div class="tg-content">
        <div class="tg-title"></div>
        <div class="tg-desc"></div>
        <div class="tg-details"></div>
      </div>
      <div class="tg-btn-group">
        <div class="tg-buttons"></div>
        <br />
        <div class="tg-buttons"></div>
      </div>
    </div>

    <!-- Tour Card 3 -->
    <div class="tg-card">
      <div class="tg-image"></div>
      <div class="tg-content">
        <div class="tg-title"></div>
        <div class="tg-desc"></div>
        <div class="tg-details"></div>
      </div>
      <div class="tg-btn-group">
        <div class="tg-buttons"></div>
        <br />
        <div class="tg-buttons"></div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="tg-pagination">
      <span class="tg-circle"></span>
      <span class="tg-circle tg-active"></span>
      <span class="tg-circle"></span>
    </div>
  </div>
</template>

<style>
/* Preloader Layout */
.tg-preloader {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: auto;
}

/* Individual Tour Card */
.tg-card {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  height: 120px;
  padding: 15px;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

/* Image Placeholder */
.tg-image {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: tg-loading 1.5s infinite ease-in-out;
}

/* Content Section */
.tg-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Title */
.tg-title {
  width: 60%;
  height: 15px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: tg-loading 1.5s infinite ease-in-out;
}

/* Description */
.tg-desc {
  width: 80%;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: tg-loading 1.5s infinite ease-in-out;
}

/* Details (Price & Tour Operator) */
.tg-details {
  width: 50%;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: tg-loading 1.5s infinite ease-in-out;
}

/* Button Section */
.tg-buttons {
  width: 100px;
  height: 35px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: tg-loading 1.5s infinite ease-in-out;
}

/* Pagination */
.tg-pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.tg-circle {
  width: 12px;
  height: 12px;
  background: #ddd;
  border-radius: 50%;
  animation: tg-fade 1.5s infinite alternate;
}

.tg-circle.tg-active {
  background: #888;
}

/* Loading Animation */
@keyframes tg-loading {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

/* Fade Animation */
@keyframes tg-fade {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
