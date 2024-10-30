<script setup>
import { computed, onMounted, ref } from 'vue'
import { useGameEngineStore } from '@/stores/gameEngineStore'

const canvasRef = ref()
const gameEngineStore = useGameEngineStore()

// Calculate canvas size
const canvasWidth = computed(() => {
  return gameEngineStore.columns * gameEngineStore.cellSize
})
const canvasHeight = computed(() => {
  return gameEngineStore.rows * gameEngineStore.cellSize
})
const cellSize = computed(() => gameEngineStore.cellSize)

// Handle canvas clicks
const handleCanvasClick = event => {
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left // Get mouse X
  const y = event.clientY - rect.top // Get mouse Y
  const col = Math.floor(x / cellSize.value) // Calculate column based on cell size
  const row = Math.floor(y / cellSize.value) // Calculate row based on cell size
  gameEngineStore.explodeUranium(row, col) // Fire neutron
}

onMounted(() => {
  gameEngineStore.initialize(canvasRef.value) // Initialize the game engine
})
</script>

<template>
  <div class="p-4">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="handleCanvasClick"
    ></canvas>
  </div>
</template>
