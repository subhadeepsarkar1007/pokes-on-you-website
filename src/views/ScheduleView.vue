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
            <span>✅ Request Received</span>
          </div>

          <div class="my-6 text-caption text-error">
            <em>
              *Please capture a screenshot of the booking details and share the payment confirmation
              receipt once the payment has been processed.
            </em>
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
                <div class="value">{{ formattedAppointmentSlot }}</div>
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Reporting Time:</span>
              <span class="value">{{ reportingTime }}</span>
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

          <div v-if="bookingFee > 0" class="grand-total-section mb-6 pa-4 text-center">
            <div class="text-overline">Booking Fee Due</div>
            <div class="text-h4 font-weight-black">₹{{ bookingFee }}</div>
            <div class="pa-4">
              <img src="../assets/payment-qr.jpg" alt="Payment QR Code" class="payment-qr" />
            </div>
            <template v-if="hasConsultationSelection">
              <div v-if="grandTotal > 0" class="text-caption mt-1">
                Piercing services subtotal: ₹{{ grandTotal }}
              </div>
            </template>
            <template v-else>
              <div class="text-caption mt-1">Total Est. Service: ₹{{ grandTotal }}</div>
              <div class="text-caption mt-1">
                Balance Due after Service: ₹{{ grandTotal - bookingFee }}
              </div>
            </template>
          </div>
        </div>

        <v-form v-else ref="formRef" v-model="valid">
          <h2 class="text-center mb-8 menu-title">Schedule Appointment</h2>

          <div class="input-group mb-4">
            <label class="field-label">Primary Contact Information</label>
            <v-text-field
              density="compact"
              v-model="booking.name"
              :rules="rules.required"
              placeholder="Full Name"
              variant="solo"
              class="custom-input mb-2"
              flat
              @blur="booking.name = formatName(booking.name)"
            />
            <v-text-field
              density="compact"
              v-model="booking.email"
              :rules="rules.email"
              placeholder="Email Address"
              type="email"
              variant="solo"
              class="custom-input mb-2"
              flat
              @blur="booking.email = booking.email.toLowerCase().trim()"
            />
            <v-text-field
              density="compact"
              v-model="booking.phone"
              :rules="rules.phone"
              placeholder="Contact Number"
              variant="solo"
              class="custom-input mb-4"
              flat
            />

            <label class="field-label">Number of People</label>
            <v-select
              density="compact"
              v-model="booking.count"
              :items="[1, 2, 3]"
              placeholder="Select count"
              variant="solo"
              class="custom-input mb-4"
              flat
              hide-details
              @update:model-value="syncPiercees"
            />
          </div>

          <div
            v-for="(p, index) in booking.piercees"
            :key="index"
            class="piercee-section pa-4 mb-6"
          >
            <div class="d-flex justify-space-between align-center mb-2">
              <div>
                <label class="section-title">Piercee #{{ index + 1 }}</label>
                <div class="text-caption text-error">
                  <em>Choose piercings (max 3)</em>
                </div>
              </div>
              <div class="text-right piercee-price-details">
                <div class="price-tag">₹{{ getPersonTotal(index) }}</div>
              </div>
            </div>

            <v-text-field
              density="compact"
              v-model="p.name"
              :rules="rules.required"
              :placeholder="`Person ${index + 1} Name`"
              variant="underlined"
              class="mb-4 custom-input-underlined name-text-field"
              @blur="p.name = formatName(p.name)"
            />
            <div
              v-for="(sel, sIdx) in p.selections"
              :key="sIdx"
              class="d-flex align-center mt-2 animate-in"
            >
              <v-select
                density="compact"
                :model-value="sel.piercing"
                :items="getPiercingOptions(index, sIdx)"
                :rules="rules.required"
                item-title="label"
                return-object
                placeholder="Choose Piercing/Service"
                variant="underlined"
                class="flex-grow-1 custom-input-underlined piercing-select-field"
                hide-details
                clearable
                @update:model-value="(val) => onPiercingSelectionChanged(index, sel, val)"
              />

              <div
                v-if="sel.piercing && !isConsultationService(sel.piercing)"
                class="pair-checkbox-container"
              >
                <input
                  type="checkbox"
                  :id="'pair-' + index + '-' + sIdx"
                  v-model="sel.isPair"
                  class="styled-checkbox"
                  :disabled="!sel.isPair && getTotalWeight(index) >= 3"
                />
                <label :for="'pair-' + index + '-' + sIdx" class="pair-label">Pair</label>
              </div>

              <v-btn
                v-if="p.selections.length > 1"
                size="x-small"
                density="compact"
                variant="text"
                color="red-lighten-2"
                class="selection-remove-btn"
                @click="removePiercingField(index, sIdx)"
              >
                ✕
              </v-btn>
            </div>

            <v-btn
              v-if="canAddSelection(index)"
              size="x-small"
              variant="text"
              color="#8b76a2"
              class="mt-4"
              @click="addPiercingField(index)"
            >
              + Add Piercing/Service
            </v-btn>

            <div class="text-caption mt-6">
              <em>
                *All prices include basic jewelry, based on the selected piercings. Browse the
                jewellery gallery for other options
                <a class="gallery-link" href="#" @click.prevent="jewelryGalleryDialog = true"
                  >here</a
                >*
              </em>
            </div>
          </div>

          <v-row dense>
            <v-col cols="12">
              <label class="field-label">Preferred Date</label>
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    :model-value="formattedDisplayDate"
                    readonly
                    v-bind="props"
                    placeholder="DD/MM/YYYY"
                    variant="solo"
                    class="custom-input"
                    flat
                    :rules="rules.required"
                  />
                </template>
                <v-date-picker
                  v-model="booking.date"
                  @update:model-value="onDateSelected"
                  :min="todayDate"
                  :max="maxDate"
                  :allowed-dates="isDateAvailable"
                  :events="(date) => getDailyTotal(date) > 0"
                  :event-color="getEventColor"
                  color="#8b76a2"
                  hide-title
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12">
              <label class="field-label">Available Time Slots</label>
              <v-row dense>
                <v-col cols="6">
                  <v-select
                    v-model="booking.slot"
                    :items="availableSlots"
                    :rules="rules.required"
                    label="Starting Time"
                    placeholder="Select start"
                    variant="solo"
                    class="custom-input"
                    flat
                    :disabled="!booking.date || !availableSlots.length"
                    @update:model-value="slotConflictMessage = ''"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    :model-value="appointmentEndTime"
                    :items="appointmentEndTime ? [appointmentEndTime] : []"
                    label="Ending Time"
                    placeholder="Calculated end"
                    variant="solo"
                    class="custom-input"
                    flat
                    disabled
                  />
                </v-col>
              </v-row>
              <div v-if="slotConflictMessage" class="text-error text-caption mt-1" role="status">
                {{ slotConflictMessage }}
              </div>
            </v-col>
          </v-row>

          <div
            v-if="grandTotal > 0"
            class="grand-total-section mb-6 pa-3 d-flex justify-space-between align-center"
          >
            <span class="text-uppercase font-weight-bold">Total Est. Amount</span>
            <span class="text-h6 font-weight-black">₹{{ grandTotal }}</span>
          </div>

          <v-btn
            v-if="hasAnyPiercingService"
            block
            class="action-btn terms-btn mb-3"
            elevation="0"
            @click="termsDialog = true"
          >
            {{ termsConfirmed ? '✅ Policies Reviewed' : 'Review Terms & Policies' }}
          </v-btn>

          <v-btn
            :disabled="!formReady || isSubmitting"
            :loading="isSubmitting"
            block
            class="action-btn submit-btn"
            elevation="0"
            @click="submitForm"
          >
            Submit Booking Request
          </v-btn>
          <div
            v-if="hasAnyPiercingService && !termsConfirmed && valid"
            class="text-center text-error text-caption mt-2"
          >
            Please review and accept policies to submit
          </div>
        </v-form>
      </v-card>
    </v-container>

    <v-dialog v-model="anatomyDialog" max-width="450" persistent>
      <v-card class="glass-card pa-6">
        <h3 class="text-center mb-4 menu-title">Important Notice</h3>
        <v-divider class="mb-4"></v-divider>

        <div class="terms-content">
          <div class="policy-list">
            <div class="my-4 text-caption text-error">
              <em> *Ignore if consultation already taken. </em>
            </div>
          </div>
          <div class="policy-list">
            Many piercings are <strong>anatomy dependent</strong>. This means a thorough assessment
            is required to ensure the piercing can be performed safely, heal correctly, and remain
            viable long-term. <br /><br />
            Please consult with your piercer regarding your plans <strong>before</strong> booking.
            If a piercing is anatomically impossible, the piercer reserves the right to decline the
            service and cancel the booking. <br /><br />
            If you choose to book without a prior consultation and your anatomy is found to be
            unsuitable, the piercer may decline the procedure, and
            <strong>your booking fee will be forfeited</strong>. <br /><br />
          </div>
        </div>

        <v-btn block class="submit-btn action-btn" @click="anatomyDialog = false">
          I Understand & Wish to Proceed
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="jewelryGalleryDialog" max-width="1000" scrollable>
      <v-card class="glass-card pa-6">
        <h3 class="text-center mb-4 menu-title">Jewellery Gallery</h3>
        <v-divider class="mb-4"></v-divider>
        <v-card-text class="pa-0 gallery-dialog-content">
          <GalleryView embedded />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="termsDialog" max-width="500" persistent>
      <v-card class="glass-card pa-6">
        <h3 class="text-center mb-4 menu-title">Guidelines & Policies</h3>
        <v-divider class="mb-4"></v-divider>

        <div class="terms-content">
          <ul class="policy-list">
            <li>
              A booking fee of <strong>₹200 per person</strong> is required. This allows me to:
              <ul class="pl-3">
                <li>
                  Prioritize serious clients: I can focus on those truly ready for their piercing.
                </li>
                <li>
                  Efficiently plan slots: This helps manage my schedule and dedicate sufficient time
                  to each individual.
                </li>
                <li>
                  Begin necessary preparation: I can start the sterilization process well in
                  advance.
                </li>
              </ul>
            </li>
            <li>The booking fee will be adjusted against the final amount.</li>
            <li>
              This fee is <strong>non-refundable</strong> in the event of a no-show or if you
              cancel/reschedule less than 12 hours before your appointment. If I must cancel the
              appointment, you will receive a full refund.
            </li>
            <li>
              Consultation/Downsize takes 30 minutes per person when no piercing is selected.
              Piercing services take 1 hour per person. Group appointment times are calculated from
              each person's selected services.
            </li>
            <li>
              Please try to arrive within the first 30 minutes of your scheduled time. Late arrivals
              may result in extended waiting times or cancellation.
            </li>
            <li>
              If you arrive beyond the allotted slot, your appointment may be cancelled and you will
              need to rebook.
            </li>
            <li>
              <strong>Hygiene and Preparation</strong>
              <ul class="pl-3">
                <li>
                  Thorough Cleaning: The area to be pierced must be thoroughly cleaned prior to
                  arrival. For ear piercings, please wash your hair to remove oils and dirt. For
                  oral piercings, maintain rigorous oral hygiene.
                </li>
                <li>
                  Avoidance of Irritants: Do not apply makeup to the area for facial piercings.
                  Avoid lotions, perfumes, or oils on or near the site, as these can cause
                  irritation.
                </li>
                <li>
                  Appropriate Attire: Wear comfortable clothing. For navel piercings, avoid
                  high-waisted garments that put pressure on the site.
                </li>
                <li>
                  Grooming: Perform grooming (e.g., haircut, hair color, eyebrow plucking) at least
                  2 days prior. Such practices should not be performed for roughly 2 months after
                  the piercing.
                </li>
              </ul>
            </li>
            <li>
              <strong>Health and Safety</strong>
              <ul class="pl-3">
                <li>
                  Pre-Piercing Research: Research the specific piercing, procedure, healing process,
                  and potential complications such as migration, rejection, scarring, or keloids.
                  Understand that a piercing is an open wound.
                </li>
                <li>
                  Health Disclosure: Inform me of any medical conditions, medications, or allergies
                  (latex/metal). Research your family history regarding keloids and discuss it with
                  me.
                </li>
                <li>
                  Pregnancy: Do not get pierced if you are pregnant. The immune system is often too
                  weak during pregnancy to effectively fight potential infections.
                </li>
              </ul>
            </li>
            <li>
              <strong>Anatomical Assessment</strong>
              <ul class="pl-3">
                <li>
                  Certain piercings require an anatomical assessment. Be prepared to provide photos
                  if requested to determine suitability.
                </li>
                <li>
                  Not all piercings are suitable for every individual. I reserve the right to refuse
                  any piercing if I believe it is unsafe or unsuitable.
                </li>
              </ul>
            </li>
            <li>
              <strong>Substance Restrictions</strong>
              <ul class="pl-3">
                <li>
                  Do not consume alcohol or drugs before your appointment, as they affect blood
                  clotting. Do not consume alcohol within 12 hours before or after your appointment.
                  Do not come on an empty stomach; please eat a meal beforehand.
                </li>
              </ul>
            </li>
            <li>
              <strong>Medical Intervention</strong>
              <ul class="pl-3">
                <li>
                  Severe complications like infections or keloids may require professional medical
                  advice. Understand that irritation bumps are part of the healing process, whereas
                  keloids tend to be genetic.
                </li>
              </ul>
            </li>
            <li>
              <strong>Hygiene and Safety Protocols</strong>
              <ul class="pl-3">
                <li>
                  I adhere to strict hygiene and safety protocols. You are welcome to ask questions
                  regarding my practices or inspect my hygiene measures.
                </li>
              </ul>
            </li>
            <li>
              <strong>Piercing Limitations</strong>
              <ul class="pl-3">
                <li>
                  A maximum of 3 piercings will be performed in one sitting per person. For ear
                  cartilage, only one ear will be pierced per sitting. Wait at least 2 months before
                  piercing the other ear.
                </li>
              </ul>
            </li>
            <li>
              <strong>Jewelry</strong>
              <ul class="pl-3">
                <li>
                  Piercing rates include basic implant-grade titanium jewelry. Decorative options
                  are available in the Jewellery Gallery for an additional fee (including floating
                  navel upgrades). Please select your jewelry prior to your appointment to allow for
                  sterilization.
                  <div>
                    <strong><em>Note: </em></strong> Initial jewelry must not be removed for a
                    minimum of 2 months.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <strong>Aftercare Commitment</strong>
              <ul class="pl-3">
                <li>
                  Proper aftercare is your sole responsibility. Understand that jewelry acts as a
                  foreign body and a medium for contaminants. Healing takes time.
                </li>
              </ul>
            </li>
            <li>
              <strong>Gallery Contribution</strong>
              <ul class="pl-3">
                <li>
                  You are expected to provide clear, self-taken photos of your healing piercing for
                  my gallery.
                </li>
              </ul>
            </li>
            <li>
              <strong>Travel and Lifestyle</strong>
              <ul class="pl-3">
                <li>
                  Plan your appointment only if you have no travel plans and do not intend to visit
                  pools or beaches within the next month. Travel can introduce additional bacteria
                  and make consistent aftercare difficult.
                </li>
              </ul>
            </li>
            <li>
              <strong>Piercer Fallibility</strong>
              <ul class="pl-3">
                <li>
                  Piercers are human and capable of making mistakes. If a piercing is placed
                  incorrectly or at a suboptimal angle, I will assess the situation and may offer to
                  re-pierce the area to correct the error.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div v-if="showTermsError" class="error-alert-box mt-4 pa-3 text-center">
          Please click <strong>"I Accept"</strong> to proceed.
        </div>

        <v-card-actions class="px-0 mt-6">
          <v-btn variant="text" @click="closeTerms" class="text-none">Go Back</v-btn>
          <v-spacer />
          <v-btn class="active-item-btn px-6 submit-btn" @click="confirmTerms"> I Accept </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="appointmentNoticeDialog" max-width="500" persistent>
      <v-card class="glass-card pa-6">
        <h3 class="text-center mb-4 menu-title">Appointment Details</h3>
        <v-divider class="mb-4"></v-divider>

        <div class="appointment-notice">
          <div class="appointment-notice-row">
            <span class="label">Appointment Slot:</span>
            <strong>{{ formattedAppointmentSlot }}</strong>
          </div>
          <div class="appointment-notice-row">
            <span class="label">Reporting Time:</span>
            <strong>{{ reportingTime }}</strong>
          </div>

          <p class="appointment-notice-paragraph mt-5 mb-0">
            <em>
              Please report within the first 20 minutes of your appointment slot. Late arrival may not be accommodated if it affects later appointments. Depending on the schedule and clients booked afterward, you may need to wait or your appointment may be cancelled.  If cancelled, a new appointment must be booked for another day.
            </em>
          </p>
        </div>

        <v-btn
          class="submit-btn action-btn appointment-notice-ok mt-6"
          @click="appointmentNoticeDialog = false"
        >
          OK
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import GalleryView from './GalleryView.vue'
import { db } from '../firebase'
import {
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  runTransaction,
  writeBatch,
  Timestamp,
} from 'firebase/firestore'

type PiercingOption = { label: string; price?: number; isConsultation?: boolean }
type PiercingSelection = { piercing: PiercingOption | null; isPair: boolean }
type Piercee = { name: string; selections: PiercingSelection[] }
type AppointmentDate = Date | string | number | { toDate: () => Date } | null
type AppointmentRecord = {
  id: string
  date?: AppointmentDate
  slot?: string
  count?: number
  piercees?: Piercee[]
}

class AppointmentSlotUnavailableError extends Error {
  constructor() {
    super('The selected appointment time is no longer available.')
    this.name = 'AppointmentSlotUnavailableError'
  }
}

const formRef = ref<any>(null)
const valid = ref(false)
const submitted = ref(false)
const isSubmitting = ref(false)
const appointmentNoticeDialog = ref(false)
const termsDialog = ref(false)
const jewelryGalleryDialog = ref(false)
const termsConfirmed = ref(false)
const showTermsError = ref(false)
const dateMenu = ref(false)
const slotConflictMessage = ref('')
const todayDate = new Date()
const appointments = ref<AppointmentRecord[]>([])
const anatomyDialog = ref(false)
const hasSeenAnatomyWarning = ref(false)
const unavailableDates = ref<string[]>([
  // '2026-05-15',
  // '2026-02-16',
  // '2026-02-17',
  // '2026-02-18',
  // '2026-02-19',
  // '2026-02-20',
  // '2026-09-15',
  '2026-10-02',
  '2026-10-03',
  '2026-10-04',
])

const maxDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d
})

const booking = reactive({
  name: '',
  email: '',
  phone: '',
  date: null as Date | null,
  count: 1,
  slot: '',
  piercees: [
    { name: '', selections: [{ piercing: null as PiercingOption | null, isPair: false }] },
  ],
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

const piercingOptions: PiercingOption[] = [
  { label: 'Consultation/Downsize', isConsultation: true },
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
  { label: 'Bridge (₹1000)', price: 1000 },
  { label: 'Lip (₹1000)', price: 1000 },
  { label: 'Vertical Labret (₹1000)', price: 1000 },
  { label: 'Tongue (₹1000)', price: 1000 },
  { label: 'Industrial (₹1500)', price: 1500 },
  { label: 'Nipple (₹1500)', price: 1500 },
  { label: 'Surface (₹2000)', price: 2000 },
]

// Computed Booking Fee based on head count
const isConsultationService = (service: PiercingOption | null | undefined) =>
  service?.isConsultation === true || service?.label?.toLowerCase() === 'consultation/downsize'

const hasAnyPiercingService = computed(() =>
  booking.piercees.some((person) =>
    person.selections.some(
      (selection) => selection.piercing !== null && !isConsultationService(selection.piercing),
    ),
  ),
)

const bookingFee = computed(() => {
  if (!hasAnyPiercingService.value) return 0
  const feeMap: Record<number, number> = { 1: 200, 2: 400, 3: 600 }
  return feeMap[booking.count] || 0
})

const getPersonTotal = (pIndex: number) => {
  return booking.piercees[pIndex]?.selections.reduce((sum, sel) => {
    const basePrice = sel.piercing?.price || 0
    return sum + (sel.isPair ? basePrice * 2 : basePrice)
  }, 0)
}

const hasConsultation = (pIndex: number) =>
  booking.piercees[pIndex]?.selections.some((sel) => isConsultationService(sel.piercing)) ?? false

const hasConsultationSelection = computed(() =>
  booking.piercees.some((_, index) => hasConsultation(index)),
)

const getPiercingOptions = (pIndex: number, sIndex: number) => {
  const selections = booking.piercees[pIndex]?.selections ?? []
  const currentService = selections[sIndex]?.piercing
  const currentWeight = isRealPiercingService(currentService)
    ? selections[sIndex]?.isPair
      ? 2
      : 1
    : 0
  const weightWithoutCurrent = getTotalWeight(pIndex) - currentWeight
  const consultationSelectedElsewhere = selections.some(
    (sel, index) => index !== sIndex && isConsultationService(sel.piercing),
  )

  return piercingOptions.map((option) => ({
    ...option,
    props: {
      disabled:
        (option.isConsultation && consultationSelectedElsewhere) ||
        (!option.isConsultation && weightWithoutCurrent >= 3),
    },
  }))
}

const canAddSelection = (pIndex: number) => {
  const selections = booking.piercees[pIndex]?.selections ?? []
  return (
    selections.length < 4 &&
    (getTotalWeight(pIndex) < 3 || !selections.some((sel) => isConsultationService(sel.piercing)))
  )
}

const onPiercingSelectionChanged = (
  pIndex: number,
  selection: PiercingSelection,
  service: PiercingOption | null,
) => {
  const selections = booking.piercees[pIndex]?.selections ?? []
  const consultationAlreadySelected = selections.some(
    (currentSelection) =>
      currentSelection !== selection && isConsultationService(currentSelection.piercing),
  )
  const currentWeight = isRealPiercingService(selection.piercing) ? (selection.isPair ? 2 : 1) : 0
  const newWeight = isRealPiercingService(service) ? (selection.isPair ? 2 : 1) : 0
  if (
    (isConsultationService(service) && consultationAlreadySelected) ||
    getTotalWeight(pIndex) - currentWeight + newWeight > 3
  ) {
    return
  }

  selection.piercing = service
  slotConflictMessage.value = ''
  if (!service || isConsultationService(service)) {
    selection.isPair = false
  } else {
    checkAnatomyRequirement(service)
  }
}

const grandTotal = computed(() => {
  return (booking.piercees || []).reduce((sum, _, index) => sum + (getPersonTotal(index) || 0), 0)
})

const formatName = (val: string) => {
  if (!val) return ''
  return val
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const DAY_START_MINUTES = 15 * 60
const DAY_END_MINUTES = 18 * 60
const SLOT_STEP_MINUTES = 30

const formatTime = (minutes: number) => {
  const hour24 = Math.floor(minutes / 60)
  const minute = String(minutes % 60).padStart(2, '0')
  const period = hour24 >= 12 ? 'pm' : 'am'
  const hour12 = hour24 % 12 || 12
  return `${hour12}:${minute}${period}`
}

const parseTime = (value: string) => {
  const match = value.match(/^\s*(\d{1,2}):(\d{2})\s*(am|pm)\s*$/i)
  if (!match) return null
  let hour = Number(match[1])
  const minute = Number(match[2])
  const period = match[3]!.toLowerCase()
  if (hour < 1 || hour > 12 || minute > 59) return null
  if (period === 'pm' && hour !== 12) hour += 12
  if (period === 'am' && hour === 12) hour = 0
  return hour * 60 + minute
}

const isRealPiercingService = (service: PiercingOption | null | undefined) =>
  Boolean(service) && !isConsultationService(service)

const getPersonDurationMinutes = (person: Pick<Piercee, 'selections'> | undefined) => {
  const selections = person?.selections ?? []
  if (selections.some((selection) => isRealPiercingService(selection.piercing))) return 60
  if (selections.some((selection) => isConsultationService(selection.piercing))) return 30
  return 60
}

const bookingDurationMinutes = computed(() =>
  booking.piercees.reduce((total, person) => total + getPersonDurationMinutes(person), 0),
)

const durationLabel = computed(() => {
  const hours = Math.floor(bookingDurationMinutes.value / 60)
  const minutes = bookingDurationMinutes.value % 60
  return [hours ? `${hours}h` : '', minutes ? `${minutes}m` : ''].filter(Boolean).join(' ')
})

const appointmentEndTime = computed(() => {
  const start = parseTime(booking.slot)
  return start === null ? '' : formatTime(start + bookingDurationMinutes.value)
})

const formattedAppointmentSlot = computed(() =>
  booking.slot && appointmentEndTime.value ? `${booking.slot} - ${appointmentEndTime.value}` : '',
)

const getAppointmentDate = (date: unknown): Date | null => {
  if (!date) return null
  let parsedDate: Date
  if (date instanceof Date) {
    parsedDate = date
  } else if (typeof date === 'string' || typeof date === 'number') {
    parsedDate = new Date(date)
  } else if (typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
    parsedDate = date.toDate()
  } else {
    return null
  }
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

const getAppointmentDurationMinutes = (appointment: AppointmentRecord) => {
  if (Array.isArray(appointment.piercees) && appointment.piercees.length) {
    return appointment.piercees.reduce(
      (total: number, person) => total + getPersonDurationMinutes(person),
      0,
    )
  }
  return (Number(appointment.count) || 1) * 60
}

const getAppointmentInterval = (appointment: AppointmentRecord) => {
  const times = String(appointment.slot ?? '').match(/\d{1,2}:\d{2}\s*(?:am|pm)/gi) ?? []
  const start = times[0] ? parseTime(times[0]) : null
  if (start === null) return { start: DAY_START_MINUTES, end: DAY_END_MINUTES }

  const parsedEnd = times[1] ? parseTime(times[1]) : null
  const end = parsedEnd ?? start + getAppointmentDurationMinutes(appointment)
  return end > start ? { start, end } : { start: DAY_START_MINUTES, end: DAY_END_MINUTES }
}

const isSameDayBookingClosed = (date: Date, now = new Date()) =>
  date.toDateString() === now.toDateString() && now.getHours() >= 2

const getAvailableStartTimes = (date: Date, durationMinutes: number) => {
  const now = new Date()
  if (isSameDayBookingClosed(date, now)) return []

  const dayAppointments = appointments.value.filter((appointment) => {
    const appointmentDate = getAppointmentDate(appointment.date)
    return appointmentDate?.toDateString() === date.toDateString()
  })
  const intervals = dayAppointments.map(getAppointmentInterval)
  const isToday = date.toDateString() === now.toDateString()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const available: string[] = []

  for (
    let start = DAY_START_MINUTES;
    start + durationMinutes <= DAY_END_MINUTES;
    start += SLOT_STEP_MINUTES
  ) {
    if (isToday && start <= currentMinutes) continue
    const end = start + durationMinutes
    const overlaps = intervals.some((interval) => start < interval.end && end > interval.start)
    if (!overlaps) available.push(formatTime(start))
  }
  return available
}

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
  return (
    booking.piercees?.[pIndex]?.selections.reduce(
      (sum, sel) => sum + (isRealPiercingService(sel.piercing) ? (sel.isPair ? 2 : 1) : 0),
      0,
    ) ?? 0
  )
}

const addPiercingField = (pIndex: number) => {
  if (canAddSelection(pIndex)) {
    const piercee = booking.piercees?.[pIndex]
    if (piercee) {
      piercee.selections.push({ piercing: null, isPair: false })
      slotConflictMessage.value = ''
    }
  }
}

const removePiercingField = (pIndex: number, sIndex: number) => {
  const piercee = booking.piercees?.[pIndex]
  if (piercee) {
    piercee.selections.splice(sIndex, 1)
    slotConflictMessage.value = ''
  }
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
  slotConflictMessage.value = ''
}

const availableSlots = computed(() => {
  if (!booking.date) return []
  return getAvailableStartTimes(new Date(booking.date), bookingDurationMinutes.value)
})

const getDailyTotal = (date: unknown) => {
  const parsedDate = getAppointmentDate(date)
  if (!parsedDate) return 0
  const dateString = parsedDate.toDateString()
  return appointments.value.reduce((sum, app) => {
    const appDate = getAppointmentDate(app.date)
    return appDate?.toDateString() === dateString ? sum + (Number(app.count) || 0) : sum
  }, 0)
}

const isDateAvailable = (date: unknown) => {
  const d = getAppointmentDate(date)
  if (!d) return false

  // 1. FORMAT FOR UNAVAILABLE ARRAY (YYYY-MM-DD)
  const yyyymmdd =
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')

  if (unavailableDates.value.includes(yyyymmdd)) {
    return false
  }

  return getAvailableStartTimes(d, bookingDurationMinutes.value).length > 0
}

const getEventColor = (date: unknown) => {
  const d = getAppointmentDate(date)
  if (!d) return ''
  const dayApps = appointments.value.filter((app) => {
    return getAppointmentDate(app.date)?.toDateString() === d.toDateString()
  })

  if (!dayApps.length) return ''
  return isDateAvailable(d) ? 'orange' : 'red'
}

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
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    booking.name = formatName(booking.name)
    booking.email = booking.email.toLowerCase().trim()
    booking.piercees.forEach((p) => (p.name = formatName(p.name)))
    const { valid: isFormValid } = await formRef.value.validate()
    if (!isFormValid) return

    if (hasAnyPiercingService.value && !termsConfirmed.value) {
      showTermsError.value = true
      termsDialog.value = true
      return
    }

    if (
      !booking.date ||
      !getAvailableStartTimes(new Date(booking.date), bookingDurationMinutes.value).includes(
        booking.slot,
      )
    ) {
      booking.slot = ''
      slotConflictMessage.value = 'That start time is no longer available. Please choose another.'
      return
    }

    const appointmentDate = new Date(booking.date!)
    const startMinutes = parseTime(booking.slot)
    if (startMinutes === null) {
      throw new AppointmentSlotUnavailableError()
    }

    const endMinutes = startMinutes + bookingDurationMinutes.value
    const dateKey = [
      appointmentDate.getFullYear(),
      String(appointmentDate.getMonth() + 1).padStart(2, '0'),
      String(appointmentDate.getDate()).padStart(2, '0'),
    ].join('-')
    const slotLockRefs = Array.from(
      { length: bookingDurationMinutes.value / SLOT_STEP_MINUTES },
      (_, index) => {
        const minute = startMinutes + index * SLOT_STEP_MINUTES
        const lockId = `__slotlock__${dateKey}_${String(minute).padStart(4, '0')}`
        return doc(db, 'appointments', lockId)
      },
    )

    const startOfDay = new Date(appointmentDate)
    startOfDay.setHours(0, 0, 0, 0)
    const startOfNextDay = new Date(startOfDay)
    startOfNextDay.setDate(startOfNextDay.getDate() + 1)
    const dayAppointmentsQuery = query(
      collection(db, 'appointments'),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<', Timestamp.fromDate(startOfNextDay)),
    )
    const existingDayAppointments = await getDocs(dayAppointmentsQuery)
    const appointmentRef = doc(collection(db, 'appointments'))

    const appointmentData = {
      ...booking,
      date: Timestamp.fromDate(appointmentDate),
      piercees: booking.piercees.map((person) => ({
        name: person.name,
        selections: person.selections.map((selection) => ({
          piercing: selection.piercing ? { ...selection.piercing } : null,
          isPair: selection.isPair,
        })),
      })),
      slot: formattedAppointmentSlot.value,
      durationMinutes: bookingDurationMinutes.value,
      createdAt: serverTimestamp(),
    }

    await runTransaction(db, async (transaction) => {
      const lockSnapshots = await Promise.all(
        slotLockRefs.map((lockRef) => transaction.get(lockRef)),
      )
      const lockAppointments = await Promise.all(
        lockSnapshots.map((lock) => {
          if (!lock.exists()) return Promise.resolve(null)
          const appointmentId = lock.data().appointmentId
          return typeof appointmentId === 'string'
            ? transaction.get(doc(db, 'appointments', appointmentId))
            : Promise.resolve(null)
        }),
      )
      const appointmentSnapshots = await Promise.all(
        existingDayAppointments.docs.map((appointment) => transaction.get(appointment.ref)),
      )

      const occupiedLockExists = lockSnapshots.some((lock, index) => {
        if (!lock.exists()) return false

        const linkedAppointment = lockAppointments[index]
        if (linkedAppointment && !linkedAppointment.exists()) {
          transaction.delete(lock.ref)
          return false
        }

        return true
      })

      if (occupiedLockExists) {
        throw new AppointmentSlotUnavailableError()
      }

      const overlapsExistingAppointment = appointmentSnapshots.some((snapshot) => {
        if (!snapshot.exists()) return false
        const existingAppointment = {
          ...snapshot.data(),
          id: snapshot.id,
        } as AppointmentRecord
        const interval = getAppointmentInterval(existingAppointment)
        return startMinutes < interval.end && endMinutes > interval.start
      })

      if (overlapsExistingAppointment) {
        throw new AppointmentSlotUnavailableError()
      }

      transaction.set(appointmentRef, appointmentData)
      // Share the existing Firestore collection/rules; no date or createdAt keeps locks out of booking lists.
      slotLockRefs.forEach((lockRef, index) => {
        const lockStart = startMinutes + index * SLOT_STEP_MINUTES
        transaction.set(lockRef, {
          recordType: 'slotLock',
          appointmentId: appointmentRef.id,
          dateKey,
          startMinute: lockStart,
          endMinute: lockStart + SLOT_STEP_MINUTES,
        })
      })
    })

    submitted.value = true
    appointmentNoticeDialog.value = true

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  } catch (e) {
    if (e instanceof AppointmentSlotUnavailableError) {
      booking.slot = ''
      slotConflictMessage.value =
        'That start time was just booked. Please choose another available time.'
    } else {
      console.error('Error adding document: ', e)
      alert('Failed to save booking. Please try again.')
    }
  } finally {
    isSubmitting.value = false
  }
}

const reportingTime = computed(() => {
  if (!booking.slot) return ''

  const startTime = (booking.slot || '').split('-')[0]?.trim() || ''
  const startMinutes = parseTime(startTime)
  if (startMinutes === null) return startTime

  return `${startTime} - ${formatTime(startMinutes + 20)}`
})

const checkAnatomyRequirement = (val: PiercingOption | null) => {
  // If the user selected something and hasn't seen the warning this session
  if (val && !hasSeenAnatomyWarning.value) {
    anatomyDialog.value = true
    hasSeenAnatomyWarning.value = true
  }
}

const cleanupPastAppointments = async () => {
  // Get today's date at the very start of the day (00:00:00)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filter local appointments that have already loaded
  // or run a specific query to find old ones
  const pastAppointments = appointments.value.filter((app) => {
    const appDate = getAppointmentDate(app.date)
    return appDate !== null && appDate < today
  })

  if (pastAppointments.length === 0) return

  // Use a Batch to delete multiple documents at once for efficiency
  const batch = writeBatch(db)
  pastAppointments.forEach((app) => {
    const docRef = doc(db, 'appointments', app.id)
    batch.delete(docRef)
  })

  try {
    await batch.commit()
    console.log(`${pastAppointments.length} old appointments cleared.`)
  } catch (e) {
    console.error('Error cleaning up old appointments:', e)
  }
}

onMounted(() => {
  const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'))

  onSnapshot(q, (snapshot) => {
    appointments.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

    cleanupPastAppointments()
  })
})
</script>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
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
  background: rgba(255, 255, 255, 0.5) !important;
  border-radius: 30px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  z-index: 2;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.appointment-notice {
  color: #4a4a4a;
  font-size: 0.9rem;
  line-height: 1.6;
}

.appointment-notice-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  margin-bottom: 10px;
  padding: 10px 12px;
  border: 1px solid rgba(139, 118, 162, 0.18);
  border-radius: 12px;
  background: rgba(139, 118, 162, 0.1);
}

.appointment-notice-row .label {
  color: #6a6a6a;
  white-space: nowrap;
}

.appointment-notice-row strong {
  color: #4a4a4a;
  text-align: right;
}

.appointment-notice-paragraph {
  color: #666;
  font-size: 0.82rem;
  line-height: 1.55;
}

.appointment-notice-ok {
  width: 120px;
  min-height: 38px;
  display: flex;
  margin-inline: auto;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  min-width: 64px;
  min-height: 28px;
  box-sizing: border-box;
  background: #8b76a2;
  color: white;
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(67, 48, 86, 0.18);
}

.piercee-price-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  min-width: 0;
}

.grand-total-section {
  background: rgba(139, 118, 162, 0.1);
  border: 1px dashed #8b76a2;
  border-radius: 15px;
  color: #4a4a4a;
}

.payment-qr {
  max-width: 100%;
  /* Ensures it never overflows its parent width */
  height: auto;
  /* Maintains aspect ratio */
  display: block;
  /* Removes bottom whitespace common in images */
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

.name-text-field {
  width: calc(100% - 6px);
}

.piercing-select-field {
  margin-inline-end: 6px;
}

.pair-checkbox-container {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 48px;
  user-select: none;
}

.selection-remove-btn {
  flex: 0 0 24px;
  width: 24px;
  min-width: 24px !important;
  height: 24px;
  margin-inline-start: 2px;
  padding: 0 !important;
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
  border-radius: 15px !important;
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

.gallery-link {
  color: #6f5a86;
  text-decoration: underline;
  cursor: pointer;
}

.gallery-dialog-content {
  max-height: 70vh;
  overflow-y: auto;
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

.glass-card {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 30px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  z-index: 2;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
</style>
