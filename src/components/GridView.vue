<script setup>
import { onMounted } from 'vue'
import { useGridStore } from '@/stores/grid.js'
import { useElements } from '@/composables/useElements.js'

const gridStore = useGridStore()
const { getElementProperties } = useElements()

const changeElement = (row, col) => {
  const newElement = 'uranium' // Update this for dynamic behavior or cycle through elements
  gridStore.setElement(row, col, newElement)
}

onMounted(() => {
  gridStore.initializeGrid()
})
</script>

<template>
  <div
    class="grid gap-1"
    :style="{
      gridTemplateColumns: `repeat(${gridStore.columns}, minmax(2rem, 1fr))`,
    }"
  >
    <div
      v-for="(row, rowIndex) in gridStore.grid"
      :key="`row-${rowIndex}`"
      class="flex"
    >
      {{ row }}
      <div
        v-for="(cell, colIndex) in row"
        :key="`cell-${rowIndex}-${colIndex}`"
        :class="[
          'size-8 flex items-center justify-center cursor-pointer border text-xs',
          getElementProperties(cell).color,
        ]"
        @click="changeElement(rowIndex, colIndex)"
      >
        {{ getElementProperties(cell).label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional if you need specific scoped styles beyond Tailwind's utility classes */
</style>
