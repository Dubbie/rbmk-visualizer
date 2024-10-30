<!-- GridView.vue -->
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
  <div class="grid-container">
    <div
      v-for="(row, rowIndex) in gridStore.grid"
      :key="`row-${rowIndex}`"
      class="grid-row"
      :style="{ gridTemplateColumns: `repeat(${gridStore.columns}, 1fr)` }"
    >
      <div
        v-for="(cell, colIndex) in row"
        :key="`cell-${rowIndex}-${colIndex}`"
        class="grid-cell"
        @click="changeElement(rowIndex, colIndex)"
      >
        <div
          class="element rounded-full size-4"
          :class="getElementProperties(cell).color"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid; /* This should remain to create the overall grid */
  gap: 4px; /* Adjust spacing between grid cells */
}

.grid-row {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(30px, 1fr)
  ); /* Adjust as necessary */
}

.grid-cell {
  width: 30px; /* Cell width */
  height: 30px; /* Cell height */
  display: flex; /* Flex to center the element within the cell */
  align-items: center;
  justify-content: center;
  cursor: pointer; /* Pointer cursor on hover */
}
</style>
