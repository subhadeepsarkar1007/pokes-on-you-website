<template>
  <v-app>
    <v-app-bar flat border color="white">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title class="font-weight-bold">
        Pokes On You
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary location="left" class="pa-2">
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>

        <v-list-item prepend-icon="mdi-calendar-check" title="Schedule" to="/schedule"></v-list-item>

        <v-list-item prepend-icon="mdi-image-multiple" title="Gallery" to="/gallery"></v-list-item>

        <v-list-item prepend-icon="mdi-heart-pulse" title="Aftercare" to="/aftercare"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

// Boolean to control if the menu is visible
const drawer = ref(false)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>