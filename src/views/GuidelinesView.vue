<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="logo-wrapper">
      <img src="../assets/logo.jpg" alt="Logo" class="scrollable-logo" />
    </div>

    <v-container class="content-wrapper">
      <v-card class="glass-card pa-8 mb-10 animate-in">
        <div class="d-flex">
          <h2 class="section-title mb-6">{{ $t('guidelines.title') }}</h2>
        </div>

        <div class="policy-group mb-6">
          <h3 class="group-header">{{ $t('guidelines.bookingFeeHeader') }}</h3>
          <ul class="guideline-list">
            <li v-for="(item, i) in $tm('guidelines.bookingFeeList')" :key="i" v-html="item"></li>
          </ul>
        </div>

        <div class="policy-group">
          <h3 class="group-header">{{ $t('guidelines.durationHeader') }}</h3>
          <ul class="guideline-list">
            <li v-for="(item, i) in $tm('guidelines.durationList')" :key="i" v-html="item"></li>
          </ul>
        </div>

        <div v-for="(item, index) in $tm('guidelines.numberedPoints')" :key="index">
          <v-divider class="my-8 custom-divider"></v-divider>
          <div class="guideline-item">
            <div class="guideline-number">{{ (index + 1).toString().padStart(2, '0') }}</div>
            <div class="guideline-body">
              <h3>{{ item.title }}</h3>
              <p v-for="(para, pIdx) in item.content" :key="pIdx" v-html="para"></p>

              <router-link v-if="index === 7" to="/gallery" class="gallery-inline-link">
                <span>&#128279;</span> {{ $t('nav.gallery') }}
              </router-link>
            </div>
          </div>
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
  width: 100%;
  height: 100%;
  position: fixed;
  /* Keep it fixed */
  top: 0;
  left: 0;
  z-index: 0;
  /* Add this to help GPU */
  backface-visibility: hidden;
  transform: translateZ(0);
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
}

.guideline-list li {
  margin-bottom: 10px;
  line-height: 1.6;
}

.guideline-list ul {
  padding-left: 20px;
  margin-top: 8px;
  list-style-type: circle;
}

.custom-divider {
  border-color: rgba(0, 0, 0, 0.1) !important;
}

.guideline-item {
  display: flex;
  gap: 25px;
  align-items: flex-start;
}

.guideline-number {
  font-size: 2.2rem;
  font-weight: 900;
  color: #222;
  line-height: 1;
  min-width: 50px;
}

.guideline-body h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #222;
}

.guideline-body p {
  line-height: 1.6;
  color: #444;
  margin-bottom: 14px;
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
