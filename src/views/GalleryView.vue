<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="logo-wrapper">
      <img src="../assets/logo.jpg" alt="Logo" class="scrollable-logo" />
    </div>

    <v-container fluid class="gallery-container">
      <v-row dense>
        <v-col v-for="(img, index) in images" :key="img" cols="4" sm="4" md="4">
          <v-card class="ma-1 gallery-card" flat color="transparent">
            <v-img :src="img" aspect-ratio="1" cover class="gallery-thumb loading-blur" loading="lazy"
              @click="open(index)" @load="(e) => e.target.closest('.v-img').classList.remove('loading-blur')">
              <template v-slot:placeholder>
                <div class="placeholder-skeleton"></div>
              </template>
            </v-img>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="90vw" @click:outside="dialog = false">
        <v-card class="dialog-card glass-morphism" flat @click="dialog = false">
          <v-card-text class="pa-0 d-flex align-center justify-center">
            <div class="image-wrapper">
              <v-img :src="images[selectedIndex]" class="dialog-image" content-class="custom-img-fit"
                transition="fade-transition">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="#8b76a2" />
                  </v-row>
                </template>
              </v-img>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const modules = import.meta.glob('/src/assets/*.{png,jpg,jpeg,svg,gif,webp}', {
  eager: false,
}) as Record<string, () => Promise<{ default: string }>>

const exclude = ['logo.jpg', 'icon.jpg']

const images = ref<string[]>([])
const dialog = ref(false)
const selectedIndex = ref(0)

onMounted(async () => {
  const validPaths = Object.keys(modules).filter((path) => {
    const name = path.split('/').pop() || ''
    return !exclude.includes(name)
  })

  const resolvedImages = await Promise.all(validPaths.map((path) => modules[path]()))
  images.value = resolvedImages.map((mod) => mod.default)
})

function open(index: number) {
  selectedIndex.value = index
  dialog.value = true
}
</script>

<style scoped>
/* Layout Styles Stay the Same */
.page-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.secondary-bg-abs {
  background-color: #d8d9f7;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}

.top-spacer {
  height: 80px;
  flex-shrink: 0;
  z-index: 2;
  position: relative;
}

.scroll-wrapper {
  flex: 1;
  overflow: visible;
  z-index: 1;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
  top: -60px;
  margin-bottom: -70px;
}

.scrollable-logo {
  height: 180px;
  /* Adjusted for better viewport fit */
  width: auto;
  object-fit: contain;
}

.gallery-container {
  position: relative;
  z-index: 1;
  padding-bottom: 80px;
}

/* NEW: HAZY LOADING LOGIC */

/* 1. The initial state: Blurred and slightly desaturated */
.gallery-thumb {
  cursor: pointer;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease-in-out;
  overflow: hidden;
}

/* We target the internal image element directly */
.loading-blur :deep(.v-img__img) {
  filter: blur(15px) grayscale(20%);
  transform: scale(1.1);
  /* Slightly zoom to hide blurred edges */
}

/* 2. The finished state: Transition to clear */
.gallery-thumb :deep(.v-img__img) {
  filter: blur(0px) grayscale(0%);
  transform: scale(1);
  transition:
    filter 0.8s ease-out,
    transform 0.8s ease-out;
}

.placeholder-skeleton {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
}

.gallery-thumb:hover {
  transform: scale(1.02);
}

/* Dialog Styles */
.glass-morphism {
  background: rgba(255, 255, 255, 0.82) !important;
  backdrop-filter: blur(25px) saturate(190%) !important;
  border-radius: 20px !important;
}

.image-wrapper {
  width: 100%;
  max-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.dialog-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
}

:deep(.custom-img-fit) {
  object-fit: contain !important;
}
</style>
