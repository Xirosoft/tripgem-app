<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue'
// import { TransitionGroup } from 'vue'

defineOptions({
  name: 'SideBar',
})

const route = useRoute()
// const router = useRouter()

const openGroups = ref([])

const menuToggle = (event) => {
  const menuItem = event.target.closest('.menu-item')
  if (menuItem) {
    menuItem.classList.toggle('active')
    const isOpen = menuItem.classList.toggle('open')

    // Update openGroups based on menu state
    const menuTitle = menuItem.querySelector('[data-i18n]')?.textContent
    if (menuTitle) {
      if (isOpen && !openGroups.value.includes(menuTitle)) openGroups.value.push(menuTitle)
      else openGroups.value = openGroups.value.filter((group) => group !== menuTitle)
    }
  }
}
</script>

<template>
  <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <!-- App Brand -->
    <div class="app-brand demo">
      <a href="index.html" class="app-brand-link">
        <span class="app-brand-logo demo"><img src="/favicon.png" alt /></span>
        <span class="app-brand-text demo menu-text fw-bold">Tripgem</span>
      </a>

      <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
        <i class="ti menu-toggle-icon d-none d-xl-block align-middle"></i>
        <i class="ti ti-x d-block d-xl-none ti-md align-middle"></i>
      </a>
    </div>

    <div class="menu-inner-shadow"></div>

    <!-- Navigation Menu -->
    <ul class="menu-inner py-1">
      <!-- Navigation Items -->
      <li
        v-for="(item, index) in navigationItems"
        :key="index"
        class="menu-item"
        :class="{
          active: route.path === item.to,
          open: openGroups.value.includes(item.title),
        }"
      >
        <a
          href="javascript:void(0);"
          class="menu-link"
          :class="{ 'menu-toggle': item.children }"
          @click="menuToggle"
        >
          <i class="menu-icon tf-icons" :class="item.icon"></i>
          <div :data-i18n="item.title">{{ item.title }}</div>
          <div v-if="item.badge" :class="['badge rounded-pill ms-auto', item.badge.class]">
            {{ item.badge.content }}
          </div>
        </a>

        <!-- Submenu -->
        <TransitionGroup v-if="item.children" name="transition-slide-x">
          <ul class="menu-sub">
            <li
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              class="menu-item"
              :class="{ active: route.path === child.to }"
            >
              <a :href="child.to" class="menu-link">
                <div :data-i18n="child.title">{{ child.title }}</div>
              </a>
            </li>
          </ul>
        </TransitionGroup>
      </li>
    </ul>
  </aside>
</template>

<style lang="scss" scoped>
.nav-group {
  &-label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}

.transition-slide-x-enter-active,
.transition-slide-x-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.transition-slide-x-enter-from,
.transition-slide-x-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
