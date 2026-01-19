<template>
  <div class="toggle-container" @click="toggle">
    <div class="toggle-track" :class="{ 'is-bn': modelValue === 'bn' }">
      <div class="label" :class="{ 'active-text': modelValue === 'en' }">en</div>
      <div class="label" :class="{ 'active-text': modelValue === 'bn' }">bn</div>
      <div class="toggle-thumb"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', props.modelValue === 'en' ? 'bn' : 'en')
}
</script>

<style scoped>
.toggle-container {
  cursor: pointer;
  user-select: none;
  width: 55px;
  /* Reduced from 70px */
  height: 26px;
  /* Reduced from 32px */
  display: flex;
  align-items: center;
}

.toggle-track {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #8b76a2;
  /* Your primary brand purple */
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  transition: all 0.3s ease;
}

.label {
  font-size: 10px;
  /* Smaller font */
  font-weight: 800;
  color: rgba(255, 255, 255, 0.6);
  /* Muted white when not active */
  text-transform: uppercase;
  z-index: 1;
  transition: color 0.3s ease;
}

/* Color of the text inside the white thumb */
.active-text {
  color: #8b76a2;
  /* Matches track color when thumb is over it */
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  /* Reduced from 26px */
  height: 22px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Shifted distance adjusted for new width */
.is-bn .toggle-thumb {
  transform: translateX(30px);
}
</style>