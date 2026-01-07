<template>
  <v-app :style="appStyle">
    <v-app-bar app color="transparent" elevation="0" flat class="top-nav-bar">
      <v-btn icon @click="drawer = !drawer" aria-label="Menu" class="hamburger-btn">
        <span class="hamburger" :class="{ 'is-open': drawer }" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary location="top" class="custom-drawer" elevation="0">
      <v-list nav class="drawer-list">
        <v-list-item to="/" @click="drawer = false" title="Home" class="menu-item" />
        <v-list-item to="/schedule" @click="drawer = false" title="Schedule" class="menu-item" />
        <v-list-item to="/gallery" @click="drawer = false" title="Gallery" class="menu-item" />
        <v-list-item to="/aftercare" @click="drawer = false" title="Aftercare" class="menu-item" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Updated to match your new filename
import bg from '@/assets/home-background.jpg'

const drawer = ref(false)

const appStyle = {
  backgroundImage: `url(${bg})`,
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
}
</script>

<style scoped>
/* 1. Centered Floating Menu Styling */
.custom-drawer {
  /* Pushes the drawer down towards the center so the 'X' button is clear */
  top: 8% !important;
  margin: 0 20px !important;
  width: calc(100% - 40px) !important;

  /* Glassmorphism & Shape */
  background: rgba(255, 255, 255, 0.82) !important;
  backdrop-filter: blur(25px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(25px) saturate(190%) !important;
  border-radius: 30px !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25) !important;

  /* Layout */
  height: auto !important;
  max-height: 50vh;
  overflow: hidden !important;
}

/* Hide drawer logic to remove whitish artifacts when closed */
.v-navigation-drawer--temporary:not(.v-navigation-drawer--active) {
  display: none !important;
}

/* 2. Menu Item Styling */
.drawer-list {
  background: transparent !important;
  padding: 12px !important;
}

.menu-item {
  margin-bottom: 6px !important;
  border-radius: 15px !important;
  background: rgba(0, 0, 0, 0.04) !important;
}

/* 3. Navigation Bar & Hamburger Button */
.top-nav-bar {
  z-index: 10001 !important;
  /* Keep it above the drawer at all times */
}

.hamburger-btn {
  z-index: 10002 !important;
}

.hamburger {
  display: inline-block;
  width: 22px;
  height: 16px;
  position: relative;
}

.hamburger span {
  display: block;
  position: absolute;
  left: 0;
  height: 2px;
  width: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  background: #ffffff !important;
  /* White for visibility on your purple background */
}

/* Change button to dark grey when menu is open for contrast on the white glass */
.hamburger.is-open span {
  background: #ffffff !important;
}

/* Animation to 'X' */
.hamburger span:nth-child(1) {
  top: 0;
}

.hamburger span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}

.hamburger span:nth-child(3) {
  bottom: 0;
}

.hamburger.is-open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.is-open span:nth-child(2) {
  opacity: 0;
}

.hamburger.is-open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Global Cleanup to ensure background image shows through */
:deep(.v-application) {
  background: transparent !important;
}

.custom-footer {
  background: transparent !important;
  backdrop-filter: blur(5px);
}
</style>