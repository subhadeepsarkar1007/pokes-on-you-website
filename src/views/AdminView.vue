<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <v-container class="admin-container">
      <v-card class="custom-glass-card">
        <section
          v-for="group in groupedAppointments"
          :key="group.key"
          class="date-section"
        >
          <div class="date-heading">
            {{ formatDateHeading(group.date) }}
          </div>

          <div
            v-for="(item, index) in group.appointments"
            :key="item.id"
            :class="index % 2 === 0 ? 'row-even' : 'row-odd'"
            class="mobile-row"
          >
            <div class="pa-4">
              <div class="d-flex justify-space-between align-center">
                <div
                  @click="toggleExpanded(item.id)"
                  class="flex-grow-1 cursor-pointer"
                >
                  <div class="text-subtitle-1 font-weight-bold text-primary">
                    {{ item.name }}
                  </div>
                  <div class="text-caption font-weight-medium">
                    <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
                    {{ formatDate(item.date) }} • {{ item.slot }}
                  </div>
                </div>

                <div class="d-flex align-center">
                  <v-chip size="x-small" color="primary" variant="flat" class="mr-2">
                    {{ item.count }}
                  </v-chip>
                  <v-btn
                    :icon="expandedRows.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    variant="text"
                    density="comfortable"
                    @click="toggleExpanded(item.id)"
                  ></v-btn>
                </div>
              </div>
            </div>

            <div v-if="expandedRows.includes(item.id)" class="expanded-detail-box">
              <div v-for="(p, idx) in item.piercees" :key="idx" class="person-card mb-3">
                <div class="d-flex align-center mb-1">
                  <strong>{{ p.name }}</strong>
                </div>
                <div class="text-caption pl-6 text-grey-darken-2">
                  {{
                    p.selections
                      .map((s: any) => `${s.piercing.label}${s.isPair ? ' (Pair)' : ''}`)
                      .join(', ')
                  }}
                </div>
              </div>

              <v-divider class="my-3"></v-divider>

              <div class="d-flex flex-column gap-2">
                <div class="text-caption d-flex align-center mb-1">{{ item.phone }}</div>
                <div class="text-caption d-flex align-center">{{ item.email }}</div>
                <v-btn
                  color="red-lighten-4"
                  class="text-red-darken-4 mt-4"
                  flat
                  block
                  size="small"
                  @click="confirmDelete(item.id)"
                >
                  Delete Appointment
                </v-btn>
              </div>
            </div>
          </div>
        </section>
      </v-card>
    </v-container>

    <v-dialog v-model="deleteDialog" max-width="340">
      <v-card class="pa-4 rounded-xl">
        <v-card-title class="text-center">Delete Entry?</v-card-title>
        <v-card-text class="text-center text-body-2">
          This will permanently remove this appointment.
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red-darken-1" variant="elevated" @click="deleteEntry">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { db } from '../firebase'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore'

const appointments = ref<any[]>([])
const expandedRows = ref<string[]>([])
const deleteDialog = ref(false)
const selectedId = ref('')

const cleanupPastAppointments = async () => {
  // Get today's date at the very start of the day (00:00:00)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Filter local appointments that have already loaded
  // or run a specific query to find old ones
  const pastAppointments = appointments.value.filter((app) => {
    const appDate = app.date.toDate ? app.date.toDate() : new Date(app.date)
    return appDate < today
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

// Update your onMounted to run the cleanup
onMounted(() => {
  const q = query(collection(db, 'appointments'), orderBy('date', 'asc'))

  onSnapshot(q, (snapshot) => {
    appointments.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Optional: Run cleanup automatically after data loads
    cleanupPastAppointments()
  })
})

const formatDate = (date: any) => {
  if (!date) return 'N/A'
  const d = date.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const getAppointmentDate = (date: any): Date | null => {
  if (!date) return null
  const d = date.toDate ? date.toDate() : new Date(date)
  return Number.isNaN(d.getTime()) ? null : d
}

const getDateKey = (date: any) => {
  const d = getAppointmentDate(date)
  if (!d) return 'unknown'
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getStartTimeMinutes = (slot: string) => {
  if (!slot) return Number.MAX_SAFE_INTEGER
  const match = slot.match(/(\d{1,2}):(\d{2})(am|pm)/i)
  if (!match) return Number.MAX_SAFE_INTEGER

  let hours = Number(match[1]!)
  const minutes = Number(match[2]!)
  const period = match[3]!.toLowerCase()
  if (period === 'pm' && hours !== 12) hours += 12
  if (period === 'am' && hours === 12) hours = 0
  return hours * 60 + minutes
}

const groupedAppointments = computed(() => {
  const sorted = [...appointments.value].sort((a, b) => {
    const aDate = getAppointmentDate(a.date)?.getTime() ?? Number.MAX_SAFE_INTEGER
    const bDate = getAppointmentDate(b.date)?.getTime() ?? Number.MAX_SAFE_INTEGER
    if (aDate !== bDate) return aDate - bDate
    return getStartTimeMinutes(a.slot) - getStartTimeMinutes(b.slot)
  })

  const groups = new Map<string, { key: string; date: Date | null; appointments: any[] }>()
  sorted.forEach((appointment) => {
    const key = getDateKey(appointment.date)
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        date: getAppointmentDate(appointment.date),
        appointments: [],
      })
    }
    groups.get(key)!.appointments.push(appointment)
  })

  return [...groups.values()]
})

const formatDateHeading = (date: Date | null) => {
  if (!date) return 'Date unavailable'
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const toggleExpanded = (id: string) => {
  expandedRows.value = expandedRows.value.includes(id)
    ? expandedRows.value.filter((expandedId) => expandedId !== id)
    : [...expandedRows.value, id]
}

const confirmDelete = (id: string) => {
  selectedId.value = id
  deleteDialog.value = true
}

const deleteEntry = async () => {
  try {
    await deleteDoc(doc(db, 'appointments', selectedId.value))
    deleteDialog.value = false
  } catch (e) {
    alert('Error deleting document')
  }
}
</script>

<style scoped>
.page-container {
  width: 100%;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.admin-container {
  max-width: 100%;
  padding: 16px;
  padding-bottom: 100px;
}

:deep(.v-data-table-header) {
  display: none;
}

.transparent-table {
  background: transparent !important;
}

.date-section {
  padding: 12px 12px 4px;
}

.date-heading {
  margin: 8px 4px 10px;
  color: #5a3d70;
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.row-even {
  background: rgba(255, 255, 255, 0.5) !important;
}

.row-odd {
  background: rgba(255, 255, 255, 0.1) !important;
}

.mobile-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.expanded-detail-box {
  background: rgba(0, 0, 0, 0.04);
  padding: 20px;
  margin: 12px;
  border-radius: 16px;
}

.person-card {
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.custom-glass-card {
  background: rgba(255, 255, 255, 0.5) !important;
  border-radius: 30px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  z-index: 2;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Remove standard border from expanded cell */
:deep(.v-data-table__expanded-row td) {
  border-bottom: none !important;
}
</style>
