<template>
  <div class="portfolio-item">
    <img :src="image" :alt="title" class="portfolio-image" />
    <div class="portfolio-content">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <div class="portfolio-tags">
        <span v-for="(tag, index) in tags" :key="index" class="tag">
          {{ tag }}
        </span>
      </div>
      <a :href="link" target="_blank" class="portfolio-link">View Project</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortfolioItems',
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: () => [],
    },
    link: {
      type: String,
      default: '#',
    },
  },
}
</script>

<style scoped>
.portfolio-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.portfolio-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.portfolio-content {
  padding: 20px;
}

.portfolio-tags {
  margin: 10px 0;
}

.tag {
  background: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 0.9em;
}

.portfolio-link {
  display: inline-block;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 10px;
}

.portfolio-link:hover {
  background: #0056b3;
}
</style>
