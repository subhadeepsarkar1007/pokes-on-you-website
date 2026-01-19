<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="logo-wrapper">
      <img src="../assets/logo.jpg" alt="Logo" class="scrollable-logo" />
    </div>

    <v-container fluid class="gallery-container">
      <v-row class="filter-wrapper d-flex flex-wrap justify-center mb-6">
        <v-chip :class="['ma-1 filter-chip', !selectedFilter ? 'active-chip' : 'glass-chip']" elevation="0"
          @click="selectedFilter = null">
          #all
        </v-chip>

        <v-chip v-for="tag in filterTags" :key="tag"
          :class="['ma-1 filter-chip', selectedFilter === tag ? 'active-chip' : 'glass-chip']" elevation="0"
          @click="toggleFilter(tag)">
          #{{ tag }}
        </v-chip>
      </v-row>

      <v-row dense>
        <v-col v-for="(img, index) in filteredImages" :key="img" cols="4" sm="4" md="4">
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

      <v-row v-if="filteredImages.length === 0" justify="center" class="mt-10 animate-in">
        <v-col cols="12" class="text-center">
          <p class="text-subtitle-1 mt-2" style="color: #444; font-weight: 500;">
            No images found for #{{ selectedFilter }}
          </p>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog" max-width="90vw" @click:outside="dialog = false">
        <v-card class="dialog-card glass-morphism-dialog" flat @click="dialog = false">
          <v-card-text class="pa-0 d-flex align-center justify-center">
            <div class="image-wrapper">
              <v-img :src="filteredImages[selectedIndex]" class="dialog-image" content-class="custom-img-fit"
                transition="fade-transition">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="#7b62a3" />
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
import { ref, onMounted, computed } from 'vue'

const modules = import.meta.glob('/src/assets/*.{png,jpg,jpeg,svg,gif,webp}', {
  eager: false,
}) as Record<string, () => Promise<{ default: string }>>

const exclude = ['logo.jpg', 'icon.jpg']
const filterTags = ['basic', 'hiddenhelix', 'hanginghelix', 'traditionalnavel', 'floatingnavel', 'conch', 'daith', 'rook', 'septum', 'tragus', 'lobe', 'upperlobe', 'traditionalhelix', 'verticalhelix', 'forwardhelix', 'labret', 'eyebrow', 'tongue', 'nipple', "flat"]

interface GalleryImage {
  url: string
  name: string
}

const allImages = ref<GalleryImage[]>([])
const selectedFilter = ref<string | null>(null)
const dialog = ref(false)
const selectedIndex = ref(0)

onMounted(async () => {
  const validPaths = Object.keys(modules).filter((path) => {
    const name = path.split('/').pop() || ''
    return !exclude.includes(name)
  })

  const resolvedImages = await Promise.all(
    validPaths.map(async (path) => {
      const mod = await modules[path]()
      return {
        url: mod.default,
        name: path.split('/').pop()?.toLowerCase() || ''
      }
    })
  )
  allImages.value = resolvedImages
})

const filteredImagesList = computed(() => {
  if (!selectedFilter.value) return allImages.value
  return allImages.value.filter(img => img.name.includes(selectedFilter.value!.toLowerCase()))
})

const filteredImages = computed(() => filteredImagesList.value.map(img => img.url))

function toggleFilter(tag: string) {
  selectedFilter.value = selectedFilter.value === tag ? null : tag
}

function open(index: number) {
  selectedIndex.value = index
  dialog.value = true
}
</script>

<style scoped>
/* Base Layout */
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
  width: auto;
  object-fit: contain;
}

.gallery-container {
  position: relative;
  z-index: 1;
  padding-bottom: 80px;
}

/* Filter Section */
.filter-wrapper {
  position: relative;
  height: auto;
  width: auto;
  object-fit: contain;
  top: 0;
  z-index: 10;
  padding: 10px 0;
}

/* NEW Glass Morphism for Chips */
.filter-chip {
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 15px !important;
}

/* Default State: Glass Morphism with Black Text */
.glass-chip {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.03);
}

/* Active State: Lavender Shade */
.active-chip {
  background: #7b62a3 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 15px rgba(123, 98, 163, 0.3) !important;
}

/* Gallery Grid Styles */
.gallery-thumb {
  cursor: pointer;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease;
  overflow: hidden;
}

.gallery-thumb:hover {
  transform: scale(1.02);
}

/* Hazy Loading */
.loading-blur :deep(.v-img__img) {
  filter: blur(15px) grayscale(20%);
  transform: scale(1.1);
}

.gallery-thumb :deep(.v-img__img) {
  filter: blur(0px) grayscale(0%);
  transform: scale(1);
  transition: filter 0.6s ease-out, transform 0.6s ease-out;
}

.placeholder-skeleton {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}

/* Dialog Glass Morphism */
.glass-morphism-dialog {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.image-wrapper {
  width: 100%;
  max-height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
}

.dialog-image {
  border-radius: 12px;
  max-height: 80vh;
}

:deep(.custom-img-fit) {
  object-fit: contain !important;
}

.animate-in {
  animation: fadeIn 0.5s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
