<template>
  <v-container fluid class="home-bg fill-height d-flex align-center justify-center">
    <v-row core="12" class="text-center">
      <v-col>
        <div class="glass-card pa-6">
          <h1 class="text-h4 font-weight-bold mb-4">Welcome</h1>
          <p class="text-subtitle-1 mb-6">Premium Body Piercings</p>

          <v-btn color="primary" block size="large" to="/schedule" class="mb-4">
            Book Appointment
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.home-bg {
  /* This points to your uploaded image */
  background: url('@/assets/home-background.jpg') no-repeat center center;
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