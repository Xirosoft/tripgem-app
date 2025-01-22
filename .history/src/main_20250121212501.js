import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // Changed to default import
import { createApp } from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import permissionMixin from './stores/mixins/permissionMixin' // Corrected import path
import { usePermissionsStore } from './stores/permissions' // Import usePermissionsStore

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mixin(permissionMixin)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
})

app.mount('#app')

// Initialize permissions once
const permissionStore = usePermissionsStore()
console.log('Fetching initial permissions in main.js...')
permissionStore.fetchPermissions()

router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const permissionStore = usePermissionsStore()
    // Fetch permissions before redirecting
    await permissionStore.fetchPermissions()
    console.log('Permissions fetched before redirecting to:', to.name)
  }
  next()
})
