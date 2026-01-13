<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <v-container class="form-container">
      <v-card class="custom-glass-card pa-6" elevation="0">
        <h2 class="text-center mb-8 menu-title">Schedule Appointment</h2>

        <v-form ref="formRef" v-model="valid">
          <div class="input-group mb-4">
            <label class="field-label">Primary Contact Information</label>
            <v-text-field density="compact" v-model="booking.name" placeholder="Full Name" variant="solo"
              class="custom-input mb-2" flat hide-details />
            <v-text-field density="compact" v-model="booking.email" placeholder="Email Address" type="email"
              variant="solo" class="custom-input mb-2" flat hide-details />
            <v-text-field density="compact" v-model="booking.phone" placeholder="Contact Number" variant="solo"
              class="custom-input mb-4" flat hide-details />

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

            <v-text-field density="compact" v-model="p.name" placeholder="Person Name" variant="underlined"
              class="mb-4 custom-input-underlined" hide-details />

            <label class="field-label-small">Piercing Selections</label>
            <div v-for="(sel, sIdx) in p.selections" :key="sIdx" class="d-flex align-center mt-2 animate-in">
              <v-select density="compact" v-model="sel.piercing" :items="piercingOptions" item-title="label"
                return-object placeholder="Choose Piercing" variant="underlined" hide-details
                class="flex-grow-1 custom-input-underlined" />

              <v-checkbox v-model="sel.isPair" label="Pair" density="compact" color="purple" hide-details
                :disabled="!sel.isPair && getTotalWeight(index) >= 3" />

              <v-btn v-if="p.selections.length > 1" size="x-small" variant="text" color="red-lighten-2"
                class="ml-1 px-0 min-width-0 delete-x-btn" @click="removePiercingField(index, sIdx)">
                ✕
              </v-btn>
            </div>

            <v-btn v-if="getTotalWeight(index) < 3" size="x-small" variant="text" color="#8b76a2" class="mt-2"
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
                    variant="solo" class="custom-input" flat hide-details />
                </template>
                <v-date-picker v-model="booking.date" @update:model-value="dateMenu = false" :min="todayDate"
                  :allowed-dates="isNotMonday" color="#8b76a2"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="6">
              <label class="field-label">Available Time Slots</label>
              <v-select v-model="booking.slot" :items="availableSlots" placeholder="Select a time" variant="solo"
                class="custom-input" flat hide-details :disabled="!booking.date" />
            </v-col>
          </v-row>

          <div v-if="grandTotal > 0" class="grand-total-section mb-6 pa-3 d-flex justify-space-between align-center">
            <span class="text-uppercase font-weight-bold">Total Est. Amount</span>
            <span class="text-h6 font-weight-black">₹{{ grandTotal }}</span>
          </div>

          <v-btn block class="action-btn terms-btn mb-3" elevation="0" @click="termsDialog = true">
            Review Terms & Policies
          </v-btn>

          <v-btn :disabled="!formReady" block class="action-btn submit-btn" elevation="0" @click="submitForm">
            Submit Booking Request
          </v-btn>
        </v-form>
      </v-card>
    </v-container>

    <v-dialog v-model="termsDialog" max-width="500" persistent>
      <v-card class="custom-glass-card pa-6">
        <h3 class="text-center mb-4 menu-title">Studio Policies</h3>
        <v-divider class="mb-4"></v-divider>
        <div class="terms-content">
          <v-radio-group v-model="legal.cancellation" class="compact-radio" hide-details>
            <v-radio label="I agree to 24h cancellation notice" value="agreed" color="#8b76a2" />
          </v-radio-group>
          <v-checkbox v-model="legal.noshow" label="I agree to the No-Show policy" hide-details />
          <v-checkbox v-model="legal.guidelines" label="I agree to health guidelines" hide-details />
          <v-checkbox v-model="legal.idPolicy" label="I will bring a valid Photo ID" hide-details />
        </div>
        <v-card-actions class="px-0 mt-6">
          <v-btn variant="text" @click="termsDialog = false" class="text-none">Go Back</v-btn>
          <v-spacer />
          <v-btn class="active-item-btn px-6" :disabled="!allChecked" @click="confirmTerms">I Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const valid = ref(false)
const termsDialog = ref(false)
const termsConfirmed = ref(false)
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

const legal = reactive({ cancellation: '', noshow: false, guidelines: false, idPolicy: false })

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
]

// Logic to calculate price for one person
const getPersonTotal = (pIndex: number) => {
  return booking.piercees[pIndex].selections.reduce((sum, sel) => {
    const basePrice = sel.piercing?.price || 0
    return sum + (sel.isPair ? basePrice * 2 : basePrice)
  }, 0)
}

// Logic for grand total
const grandTotal = computed(() => {
  return booking.piercees.reduce((sum, _, index) => sum + getPersonTotal(index), 0)
})

const formattedDisplayDate = computed(() => {
  if (!booking.date) return ''
  const d = new Date(booking.date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
})

const getTotalWeight = (pIndex: number) => {
  return booking.piercees[pIndex].selections.reduce((sum, sel) => {
    return sum + (sel.isPair ? 2 : 1)
  }, 0)
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
  const diff = val - booking.piercees.length
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      booking.piercees.push({ name: '', selections: [{ piercing: null, isPair: false }] })
    }
  } else {
    booking.piercees.splice(val)
  }
}

const availableSlots = computed(() => {
  if (!booking.date) return []
  const d = new Date(booking.date)
  const day = d.getUTCDay()
  if (day === 1) return ['Closed on Mondays']
  if (day >= 2 && day <= 5) return ['4:00-4:30']
  if (booking.count === 1) return ['12:00-12:30', '2:00-2:30', '4:00-4:30']
  if (booking.count === 2) return ['12:00-12:30', '3:00-3:30']
  if (booking.count === 3) return ['1:00-2:00']
  return []
})

const isNotMonday = (date: unknown) => {
  const d = new Date(date as string | number | Date)
  const day = d.getUTCDay()
  return day !== 1
}

const allChecked = computed(
  () => legal.cancellation && legal.noshow && legal.guidelines && legal.idPolicy,
)

const formReady = computed(() => {
  const basicInfo = booking.name && booking.email && booking.date && booking.slot
  const slotValid = booking.slot && !booking.slot.includes('Closed')
  return basicInfo && slotValid && termsConfirmed.value
})

const confirmTerms = () => {
  termsConfirmed.value = true
  termsDialog.value = false
}

const submitForm = () => alert('Booking submitted successfully!')
</script>

<style scoped>
/* Added Styles for Pricing */
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

/* Original Styles */
.secondary-bg-abs {
  background: url('@/assets/secondary-background.jpg') no-repeat center center fixed;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
}

.form-container {
  position: relative;
  z-index: 1;
  padding-top: 140px;
  max-width: 500px;
  padding-bottom: 60px;
}

.custom-glass-card {
  background: rgba(255, 255, 255, 0.82) !important;
  backdrop-filter: blur(25px) saturate(190%) !important;
  border-radius: 30px !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6a6a6a;
  margin-bottom: 6px;
}

.section-title {
  font-size: 0.95rem;
  font-weight: bold;
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

.delete-x-btn {
  font-size: 1.2rem !important;
  font-weight: bold !important;
  min-width: 32px !important;
}

.animate-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-error {
  color: #d32f2f;
  font-weight: bold;
}
</style>
