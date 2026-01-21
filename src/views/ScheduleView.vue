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
            <div class="pa-4">
              <img src="../assets/payment-qr.jpg" alt="Payment QR Code" class="payment-qr" />
            </div>
            <div class="text-caption mt-1">Total Est. Service: ₹{{ grandTotal }}</div>
            <div class="text-caption mt-1"> Balance Due after Service: ₹{{ grandTotal - bookingFee }} </div>
            <div class="ma-4 text-caption text-error">
              <em>*Take a screenshot of the details above and provide a screenshot after
                completeing the booking fee payment</em>
            </div>
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

          <v-row dense>
            <v-col cols="12" sm="6">
              <label class="field-label">Preferred Date</label>
              <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-text-field :model-value="formattedDisplayDate" readonly v-bind="props" placeholder="DD/MM/YYYY"
                    variant="solo" class="custom-input" flat :rules="rules.required" />
                </template>
                <v-date-picker v-model="booking.date" @update:model-value="onDateSelected" :min="todayDate"
                  :max="maxDate" :allowed-dates="isDateAvailable" :events="(date) => getDailyTotal(date) > 0"
                  :event-color="getEventColor" color="#8b76a2" hide-title></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="12" sm="6">
              <label class="field-label">Available Time Slots</label>
              <v-select v-model="booking.slot" :items="availableSlots" :rules="rules.required"
                placeholder="Select a time" variant="solo" class="custom-input" flat :disabled="!booking.date" />
            </v-col>
          </v-row>

          <div v-for="(p, index) in booking.piercees" :key="index" class="piercee-section pa-4 mb-6">
            <div class="d-flex justify-space-between align-center mb-2">
              <div>
                <label class="section-title">Piercee #{{ index + 1 }}</label>
                <div class="text-caption text-error">
                  <em>Choose piercings (max 3)</em>
                </div>
              </div>
              <div class="text-right">
                <div class="price-tag">₹{{ getPersonTotal(index) }}</div>
              </div>
            </div>

            <v-text-field density="compact" v-model="p.name" :rules="rules.required"
              :placeholder="`Person ${index + 1} Name`" variant="underlined" class="mb-4 custom-input-underlined" />
            <label class="field-label-small">Piercing Selections ({{ getTotalWeight(index) }}/3) </label>
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
      <v-card class="glass-card pa-6">
        <h3 class="text-center mb-4 menu-title">Guidelines & Policies</h3>
        <v-divider class="mb-4"></v-divider>

        <div class="terms-content">
          <ul class="policy-list">
            <li>
              A booking fee of <strong>₹200 per person</strong> is required. This allows me to:
              <ul class="pl-3">
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
            <li>Each appointment is allotted <strong>2 hours</strong>.</li>
            <li>Please try to arrive within the first 30 minutes of your scheduled time. Late arrivals may result in
              extended waiting times or cancellation.</li>
            <li>If you arrive beyond the allotted slot, your appointment may be cancelled and you will need to rebook.
            </li>
            <li>Hygiene and Preparation
              <ul class="pl-3">
                <li><strong>Thorough Cleaning:</strong> The area to be pierced must be thoroughly cleaned prior to
                  arrival.
                  For ear piercings, please wash your hair to remove oils and dirt. For oral piercings, maintain
                  rigorous
                  oral
                  hygiene.</li>
                <li><strong>Avoidance of Irritants:</strong> Do not apply makeup to the area for facial piercings. Avoid
                  lotions, perfumes, or oils on or near the site, as these can cause irritation.</li>
                <li><strong>Appropriate Attire:</strong> Wear comfortable clothing. For navel piercings, avoid
                  high-waisted
                  garments that put pressure on the site.</li>
                <li><strong>Grooming:</strong> Perform grooming (e.g., haircut, hair color, eyebrow plucking) at least 2
                  days
                  prior. Such practices should not be performed for roughly 2 months after the piercing.</li>
              </ul>
            </li>
            <li> Health and Safety
              <ul class="pl-3">
                <li><strong>Pre-Piercing Research:</strong> Research the specific piercing, procedure, healing process,
                  and
                  potential complications such as migration, rejection, scarring, or keloids. Understand that a piercing
                  is
                  an open wound.</li>
                <li><strong>Health Disclosure:</strong> Inform me of any medical conditions, medications, or allergies
                  (latex/metal). Research your family history regarding keloids and discuss it with me.</li>
                <li><strong>Pregnancy:</strong> Do not get pierced if you are pregnant. The immune system is often too
                  weak
                  during pregnancy to effectively fight potential infections.</li>
              </ul>
            </li>
            <li> Anatomical Assessment
              <ul class="pl-3">
                <li>Certain piercings require an anatomical assessment. Be prepared to provide photos if requested to
                  determine suitability.</li>
                <li>Not all piercings are suitable for every individual. I reserve the right to refuse any piercing if
                  I believe it is unsafe or unsuitable.</li>
              </ul>
            </li>
            <li> Substance Restrictions
              <ul class="pl-3">
                <li>Do not consume alcohol or drugs before your appointment, as they affect blood clotting. Do not
                  consume
                  alcohol within 12 hours before or after your appointment. Do not come on an empty stomach; please eat
                  a
                  meal beforehand.</li>
              </ul>
            </li>
            <li> Medical Intervention
              <ul class="pl-3">
                <li>Severe complications like infections or keloids may require professional medical advice. Understand
                  that
                  irritation bumps are part of the healing process, whereas keloids tend to be genetic.</li>

              </ul>
            </li>
            <li> Hygiene and Safety Protocols
              <ul class="pl-3">
                <li>I adhere to strict hygiene and safety protocols. You are welcome to ask questions regarding my
                  practices
                  or inspect my hygiene measures.</li>

              </ul>
            </li>
            <li> Piercing Limitations
              <ul class="pl-3">
                <li>A maximum of 3 piercings will be performed in one sitting per person. For ear cartilage, only one
                  ear
                  will be
                  pierced per sitting. Wait at least 2 months before piercing the other ear.</li>

              </ul>
            </li>
            <li> Jewelry
              <ul class="pl-3">
                <li>Piercing rates include basic implant-grade titanium jewelry. Decorative options are available in the
                  Jewellery Gallery for an additional fee (including floating navel upgrades).
                  Please select your jewelry prior to your appointment to allow for sterilization.
                  <strong><em>Note: </em></strong> Initial jewelry must not be removed for a minimum of 2 months.
                </li>
              </ul>
            </li>
            <li> Aftercare Commitment
              <ul class="pl-3">
                <li>Proper aftercare is your sole responsibility. Understand that jewelry acts as a foreign body and a
                  medium for contaminants. Healing takes time.</li>

              </ul>
            </li>
            <li> Gallery Contribution
              <ul class="pl-3">
                <li>You are expected to provide clear, self-taken photos of your healing piercing for my gallery.</li>

              </ul>
            </li>
            <li> Travel and Lifestyle
              <ul class="pl-3">
                <li>Plan your appointment only if you have no travel plans and do not intend to visit pools or beaches
                  within
                  the next
                  month. Travel can introduce additional bacteria and make consistent aftercare difficult.</li>

              </ul>
            </li>
            <li> Piercer Fallibility
              <ul class="pl-3">
                <li>Piercers are human and capable of making mistakes. If a piercing is placed incorrectly or at a
                  suboptimal
                  angle, I will assess the situation and may offer to re-pierce the area to correct the error.</li>

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
import { ref, computed, reactive, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, } from 'firebase/firestore'

const formRef = ref<any>(null)
const valid = ref(false)
const submitted = ref(false)
const termsDialog = ref(false)
const termsConfirmed = ref(false)
const showTermsError = ref(false)
const dateMenu = ref(false)
const todayDate = new Date()
const appointments = ref<any[]>([])

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

// Helper to get taken slots for the currently selected date
const takenSlotsForSelectedDate = computed(() => {
  if (!booking.date) return [];
  const selectedDateStr = new Date(booking.date).toDateString();

  return appointments.value
    .filter(app => {
      const appDate = app.date?.seconds
        ? new Date(app.date.seconds * 1000)
        : new Date(app.date);
      return appDate.toDateString() === selectedDateStr;
    })
    .map(app => app.slot);
});

const availableSlots = computed(() => {
  if (!booking.date) return [];
  const d = new Date(booking.date);
  const dayOfWeek = d.getDay();

  if (dayOfWeek === 1) return ['Closed on Mondays'];

  const taken = takenSlotsForSelectedDate.value;
  const totalBooked = getDailyTotal(booking.date);
  const isRestrictedWeekday = [2, 3, 4, 5].includes(dayOfWeek);
  const isWeekend = [0, 6].includes(dayOfWeek);

  // --- TUE, WED, THU, FRI LOGIC ---
  if (isRestrictedWeekday) {
    if (booking.count === 1) {
      return (totalBooked >= 1 || taken.includes('4:00pm-6:00pm')) ? [] : ['4:00pm-6:00pm'];
    }
    return [];
  }

  // --- SAT & SUN LOGIC ---
  if (isWeekend) {
    // 3 PERSONS: 1:00pm-5:00pm only if day is totally empty
    if (booking.count === 3) {
      return (totalBooked === 0) ? ['1:00pm-5:00pm'] : [];
    }

    // 2 PERSONS
    if (booking.count === 2) {
      if (taken.includes('1:00pm-5:00pm') || taken.includes('2:00pm-4:00pm')) return [];

      let options = ['12:00pm-3:00pm', '3:00pm-6:00pm'];
      return options.filter(slot => {
        if (taken.includes(slot)) return false;
        if (slot === '12:00pm-3:00pm') {
          // Available if nothing blocks the 12-3pm range
          return !taken.includes('12:00pm-2:00pm') && !taken.includes('2:00pm-4:00pm');
        }
        if (slot === '3:00pm-6:00pm') {
          // Available if nothing blocks the 3-6pm range
          return !taken.includes('4:00pm-6:00pm') && !taken.includes('2:00pm-4:00pm');
        }
        return true;
      });
    }

    // 1 PERSON
    if (booking.count === 1) {
      if (taken.includes('1:00pm-5:00pm') || totalBooked >= 3) return [];

      let options = ['12:00pm-2:00pm', '2:00pm-4:00pm', '4:00pm-6:00pm'];
      return options.filter(slot => {
        if (taken.includes(slot)) return false;

        // Blocking based on 2-person (3hr) slots
        if (taken.includes('12:00pm-3:00pm') && slot !== '4:00pm-6:00pm') return false;
        if (taken.includes('3:00pm-6:00pm') && slot !== '12:00pm-2:00pm') return false;

        return true;
      });
    }
  }
  return [];
});

// 1. Function to get total piercees for a specific date
const getDailyTotal = (date: any) => {
  const dateString = new Date(date).toDateString();
  return appointments.value.reduce((sum, app) => {
    if (!app.date) return sum;
    const appDate = app.date.seconds
      ? new Date(app.date.seconds * 1000)
      : new Date(app.date);

    return appDate.toDateString() === dateString
      ? sum + (Number(app.count) || 0)
      : sum;
  }, 0);
};

const isDateAvailable = (date: any) => {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  if (dayOfWeek === 1) return false; // Monday check

  const dateString = d.toDateString();
  const dayApps = appointments.value.filter(app => {
    const appDate = app.date?.seconds ? new Date(app.date.seconds * 1000) : new Date(app.date);
    return appDate.toDateString() === dateString;
  });

  const takenSlots = dayApps.map(a => a.slot);
  const totalPiercees = dayApps.reduce((sum, a) => sum + (Number(a.count) || 0), 0);
  const isWeekend = [0, 6].includes(dayOfWeek);

  // --- RULE: ALWAYS DISABLE IF 3+ PIERCEES (Unless weekend 2+2 exception) ---
  if (totalPiercees >= 3) {
    if (isWeekend && booking.count === 2 && totalPiercees === 2) {
      // If one 2-person slot is taken, the other might be free
      const hasOneTwoPersonSlot = takenSlots.includes('12:00pm-3:00pm') || takenSlots.includes('3:00pm-6:00pm');
      if (hasOneTwoPersonSlot && !takenSlots.includes('2:00pm-4:00pm')) return true;
    }
    return false;
  }

  // --- TUE-FRI: Only 1 person, 1 slot ---
  if ([2, 3, 4, 5].includes(dayOfWeek)) {
    return booking.count === 1 && totalPiercees === 0;
  }

  // --- WEEKEND CAPACITY CHECK ---
  if (isWeekend) {
    if (booking.count === 3) return totalPiercees === 0;
    if (takenSlots.includes('1:00pm-5:00pm')) return false;

    // If middle slot (2-4pm) is taken, no multi-person slots are possible
    if (takenSlots.includes('2:00pm-4:00pm') && booking.count > 1) return false;
  }

  return true;
};

// 3. Function for event-color
const getEventColor = (date: any) => {
  const d = new Date(date);
  const dayApps = appointments.value.filter(app => {
    const appDate = app.date?.seconds ? new Date(app.date.seconds * 1000) : new Date(app.date);
    return appDate.toDateString() === d.toDateString();
  });

  const total = dayApps.reduce((sum, a) => sum + (Number(a.count) || 0), 0);
  const hasThreePersonSlot = dayApps.some(a => a.slot === '1:00pm-5:00pm');

  // RED if completely full (3 people or the 3-person specific block)
  // Note: 2+2 weekend scenario is also "Full"
  if (hasThreePersonSlot || total >= 3 || (total === 4)) return 'red';

  // ORANGE if partially booked
  if (total > 1) return 'orange';

  // GREEN if empty
  if (total == 1) return 'green';
};

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
    showTermsError.value = true;
    termsDialog.value = true;
    return
  }

  try {
    // Save to Firebase
    await addDoc(collection(db, "appointments"), {
      ...booking,
      createdAt: serverTimestamp() // Adds a timestamp for sorting
    });

    submitted.value = true;
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Failed to save booking. Please try again.");
  }
}

const cleanupPastAppointments = async () => {
  // Get today's date at the very start of the day (00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter local appointments that have already loaded
  // or run a specific query to find old ones
  const pastAppointments = appointments.value.filter(app => {
    const appDate = app.date.toDate ? app.date.toDate() : new Date(app.date);
    return appDate < today;
  });

  if (pastAppointments.length === 0) return;

  // Use a Batch to delete multiple documents at once for efficiency
  const batch = writeBatch(db);
  pastAppointments.forEach((app) => {
    const docRef = doc(db, "appointments", app.id);
    batch.delete(docRef);
  });

  try {
    await batch.commit();
    console.log(`${pastAppointments.length} old appointments cleared.`);
  } catch (e) {
    console.error("Error cleaning up old appointments:", e);
  }
};

onMounted(() => {
  const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    appointments.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    cleanupPastAppointments();
  });
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
  -webkit-backdrop-filter: none !important
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
  -webkit-backdrop-filter: none !important
}
</style>
