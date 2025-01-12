<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="$emit('close')">&times;</button>
      <img :src="project.image" :alt="project.title" class="modal-image">
      <h2>{{ project.title }}</h2>
      <p>{{ project.description }}</p>
      <div class="modal-tags">
        <span v-for="(tag, index) in project.tags" :key="index" class="tag">
          {{ tag }}
        </span>
      </div>
      <a :href="project.link" target="_blank" class="modal-link">Visit Project</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortfolioModal',
  props: {
    show: Boolean,
    project: Object
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.close-button {
  position: absolute;
  right: 10px;
  top: 10px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
}

.modal-tags {
  margin: 15px 0;
}

.modal-link {
  display: inline-block;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>
