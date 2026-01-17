<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="logo-wrapper">
      <img src="../assets/logo.jpg" alt="Logo" class="scrollable-logo" />
    </div>

    <v-container class="content-wrapper">
      <v-card class="glass-card pa-8 mb-10 animate-in">
        <h2 class="section-title mb-6 text-center">General Tips for Piercing Care</h2>

        <ul class="guideline-list mb-6">
          <li>Clean your piercings 1-2 times a day with saline solution. Avoid over-cleaning.</li>
          <li>Don't touch, twist, or play with your piercings. Follow LITHA (Leave It The Hell Alone).</li>
          <li>Don't touch your piercings with dirty hands. Wash your hands prior to touching the piercing.</li>
          <li>Keep your piercings dry. After cleaning/bathing, gently dry your piercings.</li>
          <li>Do not sleep on your piercing or cause trauma such as hitting, snagging, pulling, or applying pressure.
          </li>
          <li>Pain, irritation, redness, swelling, itchiness, and lymph fluid are expected in the initial stages of
            healing.</li>
          <li>Apply a warm or cold compress (if required) for swollen or irritated piercings.</li>
          <li>Do not change your jewelry for the first 2 months after getting pierced, until absolutely necessary, or as
            advised by the piercer.</li>
          <li>Sleep on a clean pillow or place a clean cloth over your pillow while sleeping.</li>
          <li>Avoid applying ointments, betadine, or alcohol to your piercings.</li>
          <li>Avoid harsh soap, shampoo, face wash, makeup, or any chemical products around your piercings for a few
            days.</li>
          <li>Avoid sour and spicy food for the first few days.</li>
          <li>Avoid pools and beaches, any public water bodies for a month after getting pierced.</li>
          <li>Keep your piercings at a safe distance from pets.</li>
          <li>Keep a check for migration or rejection.</li>
          <li>Contact your piercer or a doctor for serious complications.</li>
        </ul>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="policy-group mb-6">
          <h3 class="group-header">Navel Piercing:</h3>
          <ul class="guideline-list">
            <li>Avoid tight clothing or high-waisted pants that can rub against the piercing, cause trauma, or irritate
              the site.</li>
            <li>Avoid rigorous abdominal exercises for a few weeks.</li>
          </ul>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="policy-group mb-6">
          <h3 class="group-header">Oral Piercing:</h3>
          <ul class="guideline-list">
            <li>Practice good oral hygiene.</li>
            <li>Use mouthwash instead of brushing directly over the site.</li>
            <li>Carry saline solution to rinse after every meal.</li>
            <li>Avoid alcohol for a few weeks.</li>
            <li>Avoid kissing and oral sex during the initial healing phase.</li>
          </ul>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="d-flex justify-center mb-6">
          <v-btn variant="outlined" color="primary" href="https://safepiercing.org/aftercare/" target="_blank"
            rounded="lg">
            SafePiercing.org Aftercare
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
  background: rgba(255, 255, 255, 0.82) !important;
  backdrop-filter: blur(25px) saturate(190%) !important;
  -webkit-backdrop-filter: blur(25px) saturate(190%) !important;
  border-radius: 30px !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25) !important;
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
