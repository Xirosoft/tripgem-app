<script>
export default {
  name: 'SearchCard',
}
</script>

<template>
  <div class="preloader">
    <!-- Tour Card 1 -->
    <div class="card">
      <div class="image"></div>
      <div class="content">
        <div class="title"></div>
        <div class="desc"></div>
        <div class="details"></div>
      </div>
      <div class="buttons"></div>
      <br />
      <div class="buttons"></div>
    </div>

    <!-- Tour Card 2 -->
    <div class="card">
      <div class="image"></div>
      <div class="content">
        <div class="title"></div>
        <div class="desc"></div>
        <div class="details"></div>
      </div>
      <div class="buttons"></div>
      <br />
      <div class="buttons"></div>
    </div>

    <!-- Tour Card 3 -->
    <div class="card">
      <div class="image"></div>
      <div class="content">
        <div class="title"></div>
        <div class="desc"></div>
        <div class="details"></div>
      </div>
      <div class="buttons"></div>
      <br />
      <div class="buttons"></div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <span class="circle"></span>
      <span class="circle active"></span>
      <span class="circle"></span>
    </div>
  </div>
</template>

<style scoped>
/* Preloader Layout */
.preloader {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: auto;
}

/* Individual Tour Card */
.card {
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
.image {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: loading 1.5s infinite ease-in-out;
}

/* Content Section */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Title */
.title {
  width: 60%;
  height: 15px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: loading 1.5s infinite ease-in-out;
}

/* Description */
.desc {
  width: 80%;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: loading 1.5s infinite ease-in-out;
}

/* Details (Price & Tour Operator) */
.details {
  width: 50%;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: loading 1.5s infinite ease-in-out;
}

/* Button Section */
.buttons {
  width: 100px;
  height: 35px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e0e0e0 25%, #d0d0d0 50%, #e0e0e0 75%);
  background-size: 400% 100%;
  animation: loading 1.5s infinite ease-in-out;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.circle {
  width: 12px;
  height: 12px;
  background: #ddd;
  border-radius: 50%;
  animation: fade 1.5s infinite alternate;
}

.circle.active {
  background: #888;
}

/* Loading Animation */
@keyframes loading {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}

/* Fade Animation */
@keyframes fade {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
