<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="portfolio-grid">
    <PortfolioItem
      v-for="project in portfolioProjects"
      :key="project.id"
      v-bind="project"
      @open-portfolio="openModal(project)"
    />
    <PortfolioModal :show="showModal" :project="selectedProject" @close="closeModal" />
  </div>
</template>

<script>
import PortfolioItem from './PortfolioItem.vue'
import PortfolioModal from './PortfolioModal.vue'

export default {
  name: 'Portfolio',
  components: {
    PortfolioItem,
    PortfolioModal,
  },
  data() {
    return {
      portfolioProjects: [
        {
          id: 1,
          title: 'E-commerce Website',
          description: 'A fully responsive e-commerce platform built with Vue.js and Node.js',
          image: 'https://picsum.photos/600/400?random=1',
          tags: ['Vue.js', 'Node.js', 'MongoDB'],
          link: 'https://example.com/project1',
        },
        {
          id: 2,
          title: 'Travel Blog Platform',
          description: 'Social platform for travel enthusiasts to share their experiences',
          image: 'https://picsum.photos/600/400?random=2',
          tags: ['Vue.js', 'Firebase', 'Tailwind CSS'],
          link: 'https://example.com/project2',
        },
        {
          id: 3,
          title: 'Task Management App',
          description: 'A collaborative task management tool for remote teams',
          image: 'https://picsum.photos/600/400?random=3',
          tags: ['Vue.js', 'Vuex', 'REST API'],
          link: 'https://example.com/project3',
        },
      ],
      showModal: false,
      selectedProject: null,
    }
  },
  methods: {
    openModal(project) {
      this.selectedProject = project
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedProject = null
    },
  },
}
</script>

<style scoped>
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>
