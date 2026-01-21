<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="logo-wrapper">
      <img src="../assets/logo.jpg" alt="Logo" class="scrollable-logo" />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  width: 100%;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
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

/* 2. Logo Wrapper: Shifted Higher */
.logo-wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.scrollable-logo {
  height: 500px;
  width: auto;
  object-fit: contain;
}
</style>
