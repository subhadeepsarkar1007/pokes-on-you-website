<template>
  <div>
    <!-- background layer (keeps previous styling) -->
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <v-container fluid class="gallery-container">
      <v-row dense>
        <v-col v-for="(img, index) in images" :key="index" cols="6" sm="4" md="3">
          <v-card class="ma-1" flat tile>
            <v-img :src="img" aspect-ratio="1" class="gallery-thumb" @click="open(img)" />
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="90vw" max-height="90vh" @click:outside="dialog = false">
        <v-card class="dialog-card" flat>
          <v-card-text class="dialog-content d-flex align-center justify-center">
            <!-- Image Container with Loading Overlay -->
            <div class="image-wrapper">
              <img v-show="!imageLoading" :src="selected" class="dialog-image" alt="Selected image"
                @load="onImageLoad" />
              <v-progress-circular v-if="imageLoading" indeterminate class="loading-spinner" />
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Lazy load all common image types from the assets folder
const modules = import.meta.glob('/src/assets/*.{png,jpg,jpeg,svg,gif}', { eager: false }) as Record<string, () => Promise<{ default: string }>>

// Exclude these filenames from the gallery
const exclude = ['home-background.jpg', 'secondary-background.jpg', 'icon.jpg']

const images = ref<string[]>([])
const dialog = ref(false)
const selected = ref('')
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

function open(img: string) {
  selected.value = img
  selectedIndex.value = images.value.indexOf(img)
  dialog.value = true
  imageLoading.value = true
}

function onImageLoad() {
  imageLoading.value = false
}
</script>

<style scoped>
/* Background preserved from previous file but placed as an absolute layer */
.secondary-bg-abs {
  background: url('@/assets/secondary-background.jpg') no-repeat center center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}

.gallery-container {
  position: relative;
  z-index: 1;
  padding-top: 24px;
  padding-bottom: 48px;
}

.gallery-thumb {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.gallery-thumb:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.dialog-card {
  background: transparent;
  box-shadow: none;
  animation: lightboxFadeIn 0.3s ease-in-out;
}

@keyframes lightboxFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dialog-content {
  position: relative;
  padding: 20px 20px;
  min-height: auto;
}

.image-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-image {
  width: 80vw;
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  animation: imageSlideIn 0.2s ease-in-out;
}

@keyframes imageSlideIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>