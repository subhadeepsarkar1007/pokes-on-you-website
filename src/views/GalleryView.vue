<template>
  <v-container fluid class="side-bg fill-height d-flex align-center justify-center" />
</template>

<style scoped>
.side-bg {
  /* This points to your uploaded image */
  background: url('@/assets/side-background.jpg') no-repeat center center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

/* A "Glassmorphism" effect to make text readable over the busy background */
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
</style>