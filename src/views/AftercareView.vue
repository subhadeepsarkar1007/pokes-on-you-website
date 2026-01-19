<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="logo-wrapper">
      <img src="../assets/logo.jpg" alt="Logo" class="scrollable-logo" />
    </div>

    <v-container class="content-wrapper">
      <v-card class="glass-card pa-8 mb-10 animate-in">
        <h2 class="section-title mb-6 text-center">{{ $t('aftercare.title') }}</h2>

        <ul class="guideline-list mb-6">
          <li v-for="(tip, i) in $tm('aftercare.generalTips')" :key="i">
            {{ tip }}
          </li>
        </ul>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="policy-group mb-6">
          <h3 class="group-header">{{ $t('aftercare.navelTitle') }}</h3>
          <ul class="guideline-list">
            <li v-for="(tip, i) in $tm('aftercare.navelTips')" :key="i">
              {{ tip }}
            </li>
          </ul>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="policy-group mb-6">
          <h3 class="group-header">{{ $t('aftercare.oralTitle') }}</h3>
          <ul class="guideline-list">
            <li v-for="(tip, i) in $tm('aftercare.oralTips')" :key="i">
              {{ tip }}
            </li>
          </ul>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="d-flex justify-center mb-6">
          <v-btn variant="outlined" color="primary" href="https://safepiercing.org/aftercare/" target="_blank"
            rounded="lg">
            {{ $t('aftercare.externalLinkBtn') }}
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
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

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.5) !important;
  border-radius: 30px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  z-index: 2;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important
}

.section-title {
  color: #333;
  font-weight: 800;
  font-size: 1.6rem;
}

.group-header {
  color: #444;
  font-size: 1.15rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.guideline-list {
  padding-left: 20px;
  color: #444;
  margin-bottom: 16px;
  list-style-type: disc;
}

.guideline-list li {
  margin-bottom: 12px;
  line-height: 1.6;
}

.custom-divider {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

.animate-in {
  animation: fadeIn 0.8s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
