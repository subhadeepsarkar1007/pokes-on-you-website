<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <div class="logo-wrapper">
      <img src="../assets/logo.jpg" alt="Logo" class="scrollable-logo" />
    </div>

    <v-container class="form-container">
      <v-card class="custom-glass-card pa-6" elevation="0">
        <div v-if="submitted" class="confirmation-view animate-in">
          <h2 class="text-center mb-6 menu-title">Booking Confirmation</h2>

          <div class="status-badge mb-6">
            <span>✅Request Received</span>
          </div>

          <div class="confirmation-details mb-6">
            <div class="detail-row">
              <span class="label">Primary Contact:</span>
              <span class="value">{{ booking.name }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Appointment:</span>
              <span>
                <div class="value">{{ formattedDisplayDate }}</div>
                <div class="value">{{ booking.slot }}</div>
              </span>
              <!-- <span class="value">{{ formattedDisplayDate }} at {{ booking.slot }}</span> -->
            </div>
          </div>

          <v-divider class="mb-4"></v-divider>

          <div class="piercee-summary mb-6">
            <label class="field-label-small mb-2 d-block">Piercing Details</label>
            <div v-for="(p, idx) in booking.piercees" :key="idx" class="summary-card pa-3 mb-2">
              <div class="d-flex justify-space-between">
                <strong>{{ p.name || 'Guest ' + (idx + 1) }}</strong>
                <span class="text-caption">Piercee #{{ idx + 1 }}</span>
              </div>
              <div class="selections-list">
                {{
                  p.selections
                    .map((s) => `${s.piercing?.label || 'TBD'}${s.isPair ? ' (Pair)' : ''}`)
                    .join(', ')
                }}
              </div>
            </div>
          </div>

          <div class="grand-total-section mb-6 pa-4 text-center">
            <div class="text-overline">Booking Fee Due</div>
            <div class="text-h4 font-weight-black">₹{{ bookingFee }}</div>
            <div class="text-caption mt-1">Total Est. Service: ₹{{ grandTotal }}</div>
          </div>
        </div>

        <v-form v-else ref="formRef" v-model="valid">
          <h2 class="text-center mb-8 menu-title">Schedule Appointment</h2>

          <div class="input-group mb-4">
            <label class="field-label">Primary Contact Information</label>
            <v-text-field density="compact" v-model="booking.name" :rules="rules.required" placeholder="Full Name"
              variant="solo" class="custom-input mb-2" flat />
            <v-text-field density="compact" v-model="booking.email" :rules="rules.email" placeholder="Email Address"
              type="email" variant="solo" class="custom-input mb-2" flat />
            <v-text-field density="compact" v-model="booking.phone" :rules="rules.phone" placeholder="Contact Number"
              variant="solo" class="custom-input mb-4" flat />

            <label class="field-label">Number of People</label>
            <v-select density="compact" v-model="booking.count" :items="[1, 2, 3]" placeholder="Select count"
              variant="solo" class="custom-input mb-4" flat hide-details @update:model-value="syncPiercees" />
          </div>

          <div v-for="(p, index) in booking.piercees" :key="index" class="piercee-section pa-4 mb-4">
            <div class="d-flex justify-space-between align-center mb-2">
              <div>
                <label class="section-title">Piercee #{{ index + 1 }}</label>
                <div class="text-caption" :class="getTotalWeight(index) >= 3 ? 'text-error' : ''">
                  Slots used: {{ getTotalWeight(index) }} / 3
                </div>
              </div>
              <div class="text-right">
                <div class="price-tag">₹{{ getPersonTotal(index) }}</div>
              </div>
            </div>

            <v-text-field density="compact" v-model="p.name" :rules="rules.required" placeholder="Person Name"
              variant="underlined" class="mb-4 custom-input-underlined" />

            <label class="field-label-small">Piercing Selections</label>
            <div v-for="(sel, sIdx) in p.selections" :key="sIdx" class="d-flex align-center mt-2 animate-in">
              <v-select density="compact" v-model="sel.piercing" :items="piercingOptions" :rules="rules.required"
                item-title="label" return-object placeholder="Choose Piercing" variant="underlined"
                class="flex-grow-1 custom-input-underlined" hide-details clearable @update:model-value="
                  (val) => {
                    if (!val) sel.isPair = false
                  }
                " />

              <div v-if="sel.piercing" class="pair-checkbox-container">
                <input type="checkbox" :id="'pair-' + index + '-' + sIdx" v-model="sel.isPair" class="styled-checkbox"
                  :disabled="!sel.isPair && getTotalWeight(index) >= 3" />
                <label :for="'pair-' + index + '-' + sIdx" class="pair-label">Pair</label>
              </div>

              <v-btn v-if="p.selections.length > 1" size="small" variant="text" color="red-lighten-2"
                @click="removePiercingField(index, sIdx)">
                ✕
              </v-btn>
            </div>

            <v-btn v-if="getTotalWeight(index) < 3" size="x-small" variant="text" color="#8b76a2" class="mt-4"
              @click="addPiercingField(index)">
              + Add Piercing
            </v-btn>
          </div>

          <v-row dense class="mb-4">
            <v-col cols="12" sm="6">
              <label class="field-label">Preferred Date</label>
              <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-text-field :model-value="formattedDisplayDate" readonly v-bind="props" placeholder="DD/MM/YYYY"
                    variant="solo" class="custom-input" flat :rules="rules.required" />
                </template>
                <v-date-picker v-model="booking.date" @update:model-value="onDateSelected" :min="todayDate"
                  :allowed-dates="isNotMonday" color="#8b76a2"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="6">
              <label class="field-label">Available Time Slots</label>
              <v-select v-model="booking.slot" :items="availableSlots" :rules="rules.required"
                placeholder="Select a time" variant="solo" class="custom-input" flat :disabled="!booking.date" />
            </v-col>
          </v-row>

          <div v-if="grandTotal > 0" class="grand-total-section mb-6 pa-3 d-flex justify-space-between align-center">
            <span class="text-uppercase font-weight-bold">Total Est. Amount</span>
            <span class="text-h6 font-weight-black">₹{{ grandTotal }}</span>
          </div>

          <v-btn block class="action-btn terms-btn mb-3" elevation="0" @click="termsDialog = true">
            {{ termsConfirmed ? '✅ Policies Reviewed' : 'Review Terms & Policies' }}
          </v-btn>

          <v-btn :disabled="!formReady" block class="action-btn submit-btn" elevation="0" @click="submitForm">
            Submit Booking Request
          </v-btn>
          <div v-if="!termsConfirmed && valid" class="text-center text-error text-caption mt-2">
            Please review and accept policies to submit
          </div>
        </v-form>
      </v-card>
    </v-container>

    <v-dialog v-model="termsDialog" max-width="500" persistent>
      <v-card class="custom-glass-card pa-6">
        <h3 class="text-center mb-4 menu-title">Studio Policies</h3>
        <v-divider class="mb-4"></v-divider>

        <div class="terms-content">
          <ul class="policy-list">
            <li>I agree to provide 24-hour notice for cancellations.</li>
            <li>I understand the No-Show policy regarding appointment slots.</li>
            <li>I agree to follow all pre-piercing health guidelines.</li>
            <li>I will bring a valid Photo ID for age verification.</li>
          </ul>
        </div>

        <div v-if="showTermsError" class="error-alert-box mt-4 pa-3 text-center">
          <v-icon color="red" size="small" class="mr-2">mdi-alert-circle</v-icon>
          Please click <strong>"I Accept"</strong> to proceed.
        </div>

        <v-card-actions class="px-0 mt-6">
          <v-btn variant="text" @click="closeTerms" class="text-none">Go Back</v-btn>
          <v-spacer />
          <v-btn class="active-item-btn px-6 submit-btn" style="background: #8b76a2 !important; color: white !important"
            @click="confirmTerms">
            I Accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const formRef = ref<any>(null)
const valid = ref(false)
const submitted = ref(false)
const termsDialog = ref(false)
const termsConfirmed = ref(false)
const showTermsError = ref(false)
const dateMenu = ref(false)
const todayDate = new Date()

const booking = reactive({
  name: '',
  email: '',
  phone: '',
  date: null as Date | null,
  count: 1,
  slot: '',
  piercees: [{ name: '', selections: [{ piercing: null as any, isPair: false }] }],
})

const rules = {
  required: [(v: any) => !!v || 'Field is required'],
  email: [
    (v: string) => !!v || 'Email is required',
    (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ],
  phone: [
    (v: string) => !!v || 'Phone is required',
    (v: string) => /^\d{10}$/.test(v) || 'Phone must be 10 digits',
  ],
}

const piercingOptions = [
  { label: 'Lobe (₹500)', price: 500 },
  { label: 'Nose (₹500)', price: 500 },
  { label: 'Helix (₹700)', price: 700 },
  { label: 'Vertical Helix (₹700)', price: 700 },
  { label: 'Conch (₹700)', price: 700 },
  { label: 'Flat (₹700)', price: 700 },
  { label: 'Forward Helix (₹800)', price: 800 },
  { label: 'Tragus (₹800)', price: 800 },
  { label: 'Daith (₹1000)', price: 1000 },
  { label: 'Rook (₹1000)', price: 1000 },
  { label: 'Septum (₹1000)', price: 1000 },
  { label: 'Navel (₹1000)', price: 1000 },
  { label: 'Eyebrow (₹1000)', price: 1000 },
  { label: 'Lip (₹1000)', price: 1000 },
  { label: 'Vertical Labret (₹1000)', price: 1000 },
  { label: 'Tongue (₹1000)', price: 1000 },
  { label: 'Industrial (₹1500)', price: 1500 },
  { label: 'Nipple (₹1500)', price: 1500 },
  { label: 'Surface (₹2000)', price: 2000 },
]

// Computed Booking Fee based on head count
const bookingFee = computed(() => {
  const feeMap: Record<number, number> = { 1: 200, 2: 400, 3: 600 }
  return feeMap[booking.count] || 0
})

const getPersonTotal = (pIndex: number) => {
  return booking.piercees[pIndex].selections.reduce((sum, sel) => {
    const basePrice = sel.piercing?.price || 0
    return sum + (sel.isPair ? basePrice * 2 : basePrice)
  }, 0)
}

const grandTotal = computed(() => {
  return booking.piercees.reduce((sum, _, index) => sum + getPersonTotal(index), 0)
})

const formattedDisplayDate = computed(() => {
  if (!booking.date) return ''

  const d = new Date(booking.date)

  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})

const getTotalWeight = (pIndex: number) => {
  return booking.piercees[pIndex].selections.reduce((sum, sel) => sum + (sel.isPair ? 2 : 1), 0)
}

const addPiercingField = (pIndex: number) => {
  if (getTotalWeight(pIndex) < 3) {
    booking.piercees[pIndex].selections.push({ piercing: null, isPair: false })
  }
}

const removePiercingField = (pIndex: number, sIndex: number) => {
  booking.piercees[pIndex].selections.splice(sIndex, 1)
}

const syncPiercees = (val: number) => {
  booking.date = null
  booking.slot = ''
  const diff = val - booking.piercees.length
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      booking.piercees.push({ name: '', selections: [{ piercing: null, isPair: false }] })
    }
  } else {
    booking.piercees.splice(val)
  }
}

const onDateSelected = () => {
  dateMenu.value = false
  booking.slot = ''
}

const availableSlots = computed(() => {
  if (!booking.date) return []
  const d = new Date(booking.date)
  const day = d.getDay() // 0 = Sunday, 1 = Monday...
  if (day === 1) return ['Closed on Mondays']
  if (day >= 2 && day <= 5) return ['4:00pm-4:30pm']
  if (booking.count === 1) return ['12:00pm-12:30pm', '2:00pm-2:30pm', '4:00pm-4:30pm']
  if (booking.count === 2) return ['12:00pm-12:30pm', '3:00pm-3:30pm']
  if (booking.count === 3) return ['1:00pm-2:00pm']
  return []
})

const isNotMonday = (date: any) => new Date(date).getDay() !== 1

const formReady = computed(() => {
  const slotValid = booking.slot && !booking.slot.includes('Closed')
  return valid.value && slotValid
})

const confirmTerms = () => {
  termsConfirmed.value = true
  showTermsError.value = false
  termsDialog.value = false
}

const closeTerms = () => {
  termsDialog.value = false
  showTermsError.value = false
}

const submitForm = async () => {
  const { valid: isFormValid } = await formRef.value.validate()
  if (!isFormValid) return

  if (!termsConfirmed.value) {
    showTermsError.value = true
    termsDialog.value = true
    return
  }

  // Toggle the view
  submitted.value = true
}
</script>

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

.form-container {
  position: relative;
  z-index: 1;
  max-width: 500px;
  padding-bottom: 60px;
}

.custom-glass-card {
  background: rgba(255, 255, 255, 0.82) !important;
  backdrop-filter: blur(25px) saturate(190%) !important;
  border-radius: 30px !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.menu-title {
  color: #4a4a4a;
  font-family: inherit;
  /* Matches your current font style */
  font-weight: 700;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6a6a6a;
  margin-bottom: 6px;
}

.price-tag {
  background: #8b76a2;
  color: white;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.grand-total-section {
  background: rgba(139, 118, 162, 0.1);
  border: 1px dashed #8b76a2;
  border-radius: 15px;
  color: #4a4a4a;
}

.custom-input :deep(.v-field) {
  border-radius: 15px !important;
  background: rgba(0, 0, 0, 0.04) !important;
}

.piercee-section {
  background: rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.pair-checkbox-container {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 60px;
  user-select: none;
}

.styled-checkbox {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: #8b76a2;
}

.pair-label {
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: #4a4a4a;
  line-height: 1;
}

.action-btn {
  height: 52px !important;
  border-radius: 15px !important;
  text-transform: none !important;
  font-weight: 600 !important;
}

.submit-btn {
  background: #8b76a2 !important;
  color: white !important;
}

.terms-btn {
  background: rgba(0, 0, 0, 0.04) !important;
  color: #4a4a4a !important;
}

/* Confirmation View Styles */
.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2e7d32;
  font-weight: 600;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.detail-row .label {
  color: #6a6a6a;
}

.detail-row .value {
  font-weight: 500;
  color: #4a4a4a;
  display: flex;
  flex-direction: row-reverse;
}

.summary-card {
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

.selections-list {
  font-size: 0.85rem;
  color: #8b76a2;
  font-weight: 500;
}

.policy-list {
  padding-left: 20px;
  color: #4a4a4a;
  font-size: 0.95rem;
  line-height: 1.6;
}

.policy-list li {
  margin-bottom: 8px;
}

.error-alert-box {
  background: rgba(211, 47, 47, 0.08);
  border: 1px solid rgba(211, 47, 47, 0.3);
  border-radius: 10px;
  color: #d32f2f;
  font-size: 0.85rem;
}

.text-error {
  color: #d32f2f;
}

.animate-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
