<template>
  <div class="page-root">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="top-spacer"></div>
    <div class="scroll-wrapper">
      <v-container fluid class="gallery-container">
        <v-row dense>
          <v-col v-for="(img, index) in images" :key="index" cols="4" sm="4" md="4">
            <v-card class="ma-1 gallery-card" flat color="transparent">
              <v-img :src="img" aspect-ratio="1" cover class="gallery-thumb" @click="open(index)">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="white" />
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="85vw" @click:outside="dialog = false">
          <v-card class="dialog-card glass-morphism" flat>
            <v-card-text class="pa-0 d-flex align-center justify-center relative">
              <v-btn icon="mdi-close" class="close-btn" variant="text" color="white" @click="dialog = false"></v-btn>

              <v-btn icon="mdi-chevron-left" class="nav-btn left" variant="text" @click.stop="prev"></v-btn>

              <div class="image-wrapper">
                <img v-show="!imageLoading" :src="images[selectedIndex]" class="dialog-image" alt="Selected jewelry"
                  @load="onImageLoad" />
                <v-progress-circular v-if="imageLoading" indeterminate color="white" />
              </div>

              <v-btn icon="mdi-chevron-right" class="nav-btn right" variant="text" @click.stop="next"></v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Import images from assets folder
const modules = import.meta.glob('/src/assets/*.{png,jpg,jpeg,svg,gif,webp}', {
  eager: false,
}) as Record<string, () => Promise<{ default: string }>>

// Exclude backgrounds and icon from the gallery grid
const exclude = ['home-background.jpg', 'secondary-background.jpg', 'icon.jpg']

const images = ref<string[]>([])
const dialog = ref(false)
const selectedIndex = ref(0)
const imageLoading = ref(false)

onMounted(async () => {
  const loaded: string[] = []
  for (const path in modules) {
    const name = path.split('/').pop() || ''
    if (!exclude.includes(name)) {
      const mod = await modules[path]()
      loaded.push(mod.default)
    }
  }
  images.value = loaded
})

function open(index: number) {
  selectedIndex.value = index
  imageLoading.value = true
  dialog.value = true
}

function next() {
  imageLoading.value = true
  selectedIndex.value = (selectedIndex.value + 1) % images.value.length
}

function prev() {
  imageLoading.value = true
  selectedIndex.value = (selectedIndex.value - 1 + images.value.length) % images.value.length
}

function onImageLoad() {
  imageLoading.value = false
}
</script>

<style scoped>
.page-root {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Background is fixed so the logo stays at the top while content scrolls */
.secondary-bg-abs {
  background: url('@/assets/secondary-background.jpg') no-repeat center center fixed;
  background-size: cover;
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
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
}

.gallery-container {
  position: relative;
  z-index: 1;
  /* Adjust this padding to match the height of your logo in the background image */
  padding-top: 5px !important;
  padding-bottom: 60px;
  min-height: 100%;
}

.gallery-card {
  background: transparent !important;
}

.gallery-thumb {
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease;
}

.gallery-thumb:hover {
  transform: scale(1.03);
}

/* Lightbox Styling */
.glass-morphism {
  background: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-image {
  width: 100%;
  max-width: 80vw;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
}

.image-wrapper {
  padding: 40px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
}

.nav-btn.left {
  left: 5px;
}

.nav-btn.right {
  right: 5px;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}
</style>
