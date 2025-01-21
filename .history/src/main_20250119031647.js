import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // Changed to default import
import { createApp } from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import permissionMixin from './stores/mixins/permissionMixin' // Corrected import path

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

// Initialize permissions once after Pinia is set up
import { usePermissionsStore } from './stores/permissions' // Import usePermissionsStore
const permissionStore = usePermissionsStore()
console.log('Fetching initial permissions in main.js...')
permissionStore.fetchPermissions()
