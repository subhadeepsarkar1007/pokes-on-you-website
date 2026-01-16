<template>
  <div class="page-container">
    <div class="secondary-bg-abs" aria-hidden="true"></div>
    <v-container class="admin-container">
      <v-card class="glass-card pa-4">
        <h2 class="mb-4">Appointment Dashboard</h2>

        <v-data-table :headers="headers" :items="appointments" item-value="id" show-expand class="transparent-table"
          items-per-page="-1" hide-default-footer>
          <template v-slot:item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length" class="pa-4 bg-light">
                <div class="detail-grid">
                  <div v-for="(p, idx) in item.piercees" :key="idx" class="mb-3">
                    <strong>Person {{ idx + 1 }}: {{ p.name }}</strong>
                    <div class="text-caption">
                      {{p.selections.map(s => `${s.piercing.label}${s.isPair ? ' (Pair)' : ''}`).join(', ')}}
                    </div>
                  </div>
                  <v-divider class="my-2"></v-divider>
                  <div class="d-flex justify-space-between align-center">
                    <span>Contact: {{ item.phone }} | {{ item.email }}</span>
                    <v-btn color="red-lighten-1" size="small" @click="confirmDelete(item.id)">
                      Delete Entry
                    </v-btn>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-4 rounded-xl">
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to remove this appointment? This action cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteEntry">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore'

const appointments = ref<any[]>([])
const deleteDialog = ref(false)
const selectedId = ref('')

const headers = [
  { title: 'Customer', key: 'name' },
  { title: 'Date', key: 'date' },
  { title: 'Slot', key: 'slot' },
  { title: 'People', key: 'count' },
  { title: '', key: 'data-table-expand' },
]

// Real-time listener for appointments
onMounted(() => {
  const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    appointments.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
})

const formatDate = (date: any) => {
  if (!date) return 'N/A';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString();
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
/* Include your existing page-container and secondary-bg-abs styles here */
.admin-container {
  position: relative;
  z-index: 1;
  margin-top: 40px;
}

.transparent-table {
  background: transparent !important;
}

.bg-light {
  background: rgba(0, 0, 0, 0.03);
}
</style>
