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
        <v-list-item to="/" @click="handleNavClick" title="Home" class="menu-item" active-class="active-item" />
        <v-list-item to="/schedule" @click="handleNavClick" title="Schedule Appointment" class="menu-item"
          active-class="active-item" />
        <v-list-item to="/gallery" @click="handleNavClick" title="Jewellery Designs" class="menu-item"
          active-class="active-item" />
        <v-list-item to="/guidelines" @click="handleNavClick" title="Guidelines" class="menu-item"
          active-class="active-item" />
        <v-list-item to="/aftercare" @click="handleNavClick" title="Aftercare Tips" class="menu-item"
          active-class="active-item" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { allowNavigation } from './router/index'

const drawer = ref(false)

const appStyle = {
  backgroundColor: '#d8d9f7', // Set your hex color here
  minHeight: '100vh', // Ensure it covers the full viewport height
}

const handleNavClick = () => {
  allowNavigation() // Set the flag to true
  drawer.value = false
}
</script>

<style scoped>
/* 1. Centered Floating Menu Styling */
/* Update this section in your <style scoped> */
:deep(.v-application) {
  background-color: #d8d9f7 !important;
}

/* Ensure the main container doesn't have a white background */
:deep(.v-application__wrap) {
  background-color: transparent !important;
}

.custom-drawer {
  top: 8% !important;
  margin: 0 20px !important;
  width: calc(100% - 40px) !important;
  background: rgba(255, 255, 255, 0.82) !important;
  backdrop-filter: blur(25px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(25px) saturate(190%) !important;
  border-radius: 30px !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25) !important;
  height: auto !important;
  max-height: 50vh;
  overflow: hidden !important;
}

.v-navigation-drawer--temporary:not(.v-navigation-drawer--active) {
  display: none !important;
}

/* 2. Menu Item Styling & Centering */
.drawer-list {
  background: transparent !important;
  padding: 20px 12px !important;
  /* Adjusted for top/bottom symmetry */
}

.menu-item {
  margin-bottom: 6px !important;
  border-radius: 15px !important;
  background: transparent !important;
  /* Default transparent */
  transition: background 0.3s ease;
}

/* Only shows background when route is selected */
.active-item {
  background: rgba(0, 0, 0, 0.04) !important;
}

/* 3. Logic to center Title Text */
:deep(.v-list-item__content) {
  justify-content: center !important;
}

:deep(.v-list-item-title) {
  text-align: center !important;
  width: 100%;
}

/* 4. Navigation Bar & Hamburger */
.top-nav-bar {
  z-index: 10001 !important;
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
}

.hamburger.is-open span {
  background: #ffffff !important;
}

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

:deep(.v-application) {
  background: transparent !important;
}
</style>
