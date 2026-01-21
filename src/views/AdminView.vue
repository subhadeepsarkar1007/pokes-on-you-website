<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>

    <v-container class="admin-container">
      <v-card class="custom-glass-card">


        <v-data-table v-model:expanded="expandedRows" :items="appointments" item-value="id" show-expand
          class="transparent-table" items-per-page="-1" hide-default-footer :headers="headers">
          <template v-slot:item="{ internalItem, item, index, toggleExpand, isExpanded }">
            <tr :class="index % 2 === 0 ? 'row-even' : 'row-odd'" class="mobile-row">
              <td class="pa-4">
                <div class="d-flex justify-space-between align-center">
                  <div @click="toggleExpand(internalItem)" class="flex-grow-1 cursor-pointer">
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

                    <v-btn :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'" variant="text"
                      density="comfortable" @click="toggleExpand(internalItem)"></v-btn>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="pa-0 border-0">
                <div class="expanded-detail-box">
                  <div v-for="(p, idx) in item.piercees" :key="idx" class="person-card mb-3">
                    <div class="d-flex align-center mb-1">
                      <strong>{{ p.name }}</strong>
                    </div>
                    <div class="text-caption pl-6 text-grey-darken-2">
                      {{p.selections.map(s => `${s.piercing.label}${s.isPair ? ' (Pair)' : ''}`).join(', ')}}
                    </div>
                  </div>

                  <v-divider class="my-3"></v-divider>

                  <div class="d-flex flex-column gap-2">
                    <div class="text-caption d-flex align-center mb-1">
                      {{ item.phone }}
                    </div>
                    <div class="text-caption d-flex align-center">
                      {{ item.email }}
                    </div>
                    <v-btn color="red-lighten-4" class="text-red-darken-4 mt-4" flat block size="small"
                      @click="confirmDelete(item.id)">

                      Delete Appointment
                    </v-btn>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
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
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, writeBatch, Timestamp } from 'firebase/firestore'

const appointments = ref<any[]>([])
const expandedRows = ref([]) // Necessary to track expansion state
const deleteDialog = ref(false)
const selectedId = ref('')

const headers = [
  { title: 'Appointments', key: 'data-table-expand' },
]

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

// Update your onMounted to run the cleanup
onMounted(() => {
  const q = query(
    collection(db, "appointments"),
    orderBy("date", "asc")
  );

  onSnapshot(q, (snapshot) => {
    appointments.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Optional: Run cleanup automatically after data loads
    cleanupPastAppointments();
  });
})

const formatDate = (date: any) => {
  if (!date) return 'N/A';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

const confirmDelete = (id: string) => {
  selectedId.value = id;
  deleteDialog.value = true;
}

const deleteEntry = async () => {
  try {
    await deleteDoc(doc(db, "appointments", selectedId.value));
    deleteDialog.value = false;
  } catch (e) {
    alert("Error deleting document");
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
  -webkit-backdrop-filter: none !important
}

.cursor-pointer {
  cursor: pointer;
}

/* Remove standard border from expanded cell */
:deep(.v-data-table__expanded-row td) {
  border-bottom: none !important;
}
</style>
