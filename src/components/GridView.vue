<script setup>
import { computed, onMounted, ref } from 'vue'
import { useGameEngine } from '@/composables/useGameEngine.js'

const canvasRef = ref()
const gameEngine = useGameEngine()

// Calculate canvas size
const canvasWidth = computed(() => {
  return gameEngine.columns * gameEngine.cellSize
})
const canvasHeight = computed(() => {
  return gameEngine.rows * gameEngine.cellSize
})

// Handle canvas clicks
const handleCanvasClick = event => {
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left // Get mouse X
  const y = event.clientY - rect.top // Get mouse Y
  const col = Math.floor(x / 30) // Calculate column based on cell size
  const row = Math.floor(y / 30) // Calculate row based on cell size
  gameEngine.explodeUranium(row, col) // Fire neutron
}

onMounted(() => {
  gameEngine.initialize(canvasRef) // Initialize the game engine
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
