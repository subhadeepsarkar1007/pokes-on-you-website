<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="logo-wrapper">
      <img src="../assets/logo.jpg" alt="Logo" class="scrollable-logo" />
    </div>

    <v-container class="content-wrapper">
      <v-card class="glass-card pa-8 mb-10 animate-in">
        <div class="d-flex">
          <h2 class="section-title mb-6">**</h2>
          <h2 class="section-title ml-4 mb-6">Appointment Policies</h2>
        </div>

        <div class="policy-group mb-6">
          <h3 class="group-header">Booking Fee:</h3>
          <ul class="guideline-list">
            <li>
              A booking fee of <strong>₹200 per person</strong> is required. This allows me to:
              <ul>
                <li>Prioritize serious clients: I can focus on those truly ready for their piercing.</li>
                <li>Efficiently plan slots: This helps manage my schedule and dedicate sufficient time to each
                  individual.</li>
                <li>Begin necessary preparation: I can start the sterilization process well in advance.</li>
              </ul>
            </li>
            <li>The booking fee will be adjusted against the final amount.</li>
            <li>
              This fee is <strong>non-refundable</strong> in the event of a no-show or if you cancel/reschedule less
              than 12 hours before your
              appointment. If I must cancel the appointment, you will receive a full refund.
            </li>
          </ul>
        </div>

        <div class="policy-group">
          <h3 class="group-header">Appointment Duration:</h3>
          <ul class="guideline-list">
            <li>Each appointment is allotted <strong>2 hours</strong>.</li>
            <li>Please try to arrive within the first 30 minutes of your scheduled time. Late arrivals may result in
              extended waiting times or cancellation.</li>
            <li>If you arrive beyond the allotted slot, your appointment may be cancelled and you will need to rebook.
            </li>
          </ul>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">01</div>
          <div class="guideline-body">
            <h3>Hygiene and Preparation</h3>
            <p><strong>Thorough Cleaning:</strong> The area to be pierced must be thoroughly cleaned prior to arrival.
              For ear piercings, wash your hair to remove oils and dirt. For oral piercings, maintain rigorous oral
              hygiene.</p>
            <p><strong>Avoidance of Irritants:</strong> Do not apply makeup to the area for facial piercings. Avoid
              lotions, perfumes, or oils on or near the site, as these can cause irritation.</p>
            <p><strong>Appropriate Attire:</strong> Wear comfortable clothing. For navel piercings, avoid high-waisted
              garments that put pressure on the site.</p>
            <p><strong>Grooming:</strong> Perform grooming (e.g., haircut, hair color, eyebrow plucking) at least 2 days
              prior. Such practices should not be performed for roughly 2 months after the piercing.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">02</div>
          <div class="guideline-body">
            <h3>Health and Safety</h3>
            <p><strong>Pre-Piercing Research:</strong> Research the specific piercing, procedure, healing process, and
              potential complications such as migration, rejection, scarring, or keloids. Understand that a piercing is
              an open wound.</p>
            <p><strong>Health Disclosure:</strong> Inform me of any medical conditions, medications, or allergies
              (latex/metal). Research your family history regarding keloids and discuss it with me.</p>
            <p><strong>Pregnancy:</strong> Do not get pierced if you are pregnant. The immune system is often too weak
              during pregnancy to effectively fight potential infections.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">03</div>
          <div class="guideline-body">
            <h3>Anatomical Assessment</h3>
            <p>Certain piercings require an anatomical assessment. Be prepared to provide photos if requested to
              determine suitability.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">04</div>
          <div class="guideline-body">
            <h3>Substance Restrictions</h3>
            <p>Do not consume alcohol or drugs before your appointment, as they affect blood clotting. Do not consume
              alcohol within 12 hours before or after your appointment. Do not come on an empty stomach; please eat a
              meal beforehand.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">05</div>
          <div class="guideline-body">
            <h3>Medical Intervention</h3>
            <p>Severe complications like infections or keloids may require professional medical advice. Understand that
              irritation bumps are part of the healing process, whereas keloids tend to be genetic.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">06</div>
          <div class="guideline-body">
            <h3>Hygiene and Safety Protocols</h3>
            <p>I adhere to strict hygiene and safety protocols. You are welcome to ask questions regarding my practices
              or inspect my hygiene measures.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">07</div>
          <div class="guideline-body">
            <h3>Piercing Limitations</h3>
            <p>A maximum of 3 piercings will be performed in one sitting per person. For ear cartilage, only one ear
              will be
              pierced per sitting. Wait at least 2 months before piercing the other ear.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">08</div>
          <div class="guideline-body">
            <h3>Jewelry</h3>
            <p>
              Basic implant-grade jewelry is provided. If you would like to select fancy jewelry for your
              piercing, options are available to view in the
              <router-link to="/gallery" class="gallery-inline-link">
                <span>&#128279;</span> Jewellery designs gallery
              </router-link>.
              Please inform me of your choice before your appointment day to allow sufficient time for
              sterilization. Initial jewelry should not be removed for a minimum of 2 months.
            </p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">09</div>
          <div class="guideline-body">
            <h3>Aftercare Commitment</h3>
            <p>Proper aftercare is your sole responsibility. Understand that jewelry acts as a foreign body and a medium
              for contaminants. Healing takes time.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">10</div>
          <div class="guideline-body">
            <h3>Gallery Contribution</h3>
            <p>You are expected to provide clear, self-taken photos of your healing piercing for my gallery.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">11</div>
          <div class="guideline-body">
            <h3>Travel and Lifestyle</h3>
            <p>Plan your appointment only if you have no travel plans and do not intend to visit pools or beaches within
              the next
              month. Travel can introduce additional bacteria and make consistent aftercare difficult.</p>
          </div>
        </div>

        <v-divider class="my-8 custom-divider"></v-divider>

        <div class="guideline-item">
          <div class="guideline-number">12</div>
          <div class="guideline-body">
            <h3>Piercer Fallibility</h3>
            <p>Piercers are human and capable of making mistakes. If a piercing is placed incorrectly or at a suboptimal
              angle, I will assess the situation and may offer to re-pierce the area to correct the error.</p>
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