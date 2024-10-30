// src/stores/gameEngineStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ELEMENT_TYPES } from '@/constants'
import GridElement from '@/models/GridElement'
import Neutron from '@/models/Neutron'

export const useGameEngineStore = defineStore('gameEngine', () => {
  const columns = 30
  const rows = 20
  const cellSize = 30
  const neutrons = ref([])
  const canvasRef = ref(null)
  const gridElements = ref(
    Array.from({ length: rows }, () =>
      Array.from(
        { length: columns },
        () => new GridElement('uranium', 'rgb(37,99,235)'),
      ),
    ),
  )
  let canvas = null
  let context = null

  // Initialize the canvas and start the game loop
  const initialize = canvasParam => {
    canvas = canvasParam

    console.log('Canvas:', canvasParam)

    if (canvas) {
      console.log('Initializing!')

      context = canvas.getContext('2d')
      drawGrid()
      requestAnimationFrame(gameLoop)
    }
  }

  // Draw the grid
  const drawGrid = () => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        context.fillStyle = 'transparent'
        context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)

        // Draw the element in the cell
        const element = getElement(row, col)
        element.draw(context, col, row, cellSize)
      }
    }
  }

  // Game loop
  const gameLoop = () => {
    context.clearRect(0, 0, canvas.width, canvas.height) // Clear canvas
    drawGrid() // Redraw grid

    // Draw each neutron
    for (let i = neutrons.value.length - 1; i >= 0; i--) {
      const neutron = neutrons.value[i]

      neutron.move() // Move the neutron

      // Check for collision with uranium
      const col = Math.floor(neutron.x / cellSize)
      const row = Math.floor(neutron.y / cellSize)
      if (row >= 0 && row < rows && col >= 0 && col < columns) {
        const element = getElement(row, col)
        if (element.type === ELEMENT_TYPES.URANIUM) {
          explodeUranium(row, col) // Explode uranium if neutron collides
          neutrons.value.splice(i, 1) // Remove the neutron
          continue // Skip the rest of the loop for this neutron
        }
      }

      // Check if the neutron is out of bounds
      if (neutron.isOutOfBounds(canvas.width, canvas.height)) {
        neutrons.value.splice(i, 1) // Remove neutron if out of bounds
      } else {
        // Draw the neutron if it is within bounds using its draw method
        neutron.draw(context)
      }
    }

    requestAnimationFrame(gameLoop) // Continue the loop
  }

  const fireNeutron = (row, col) => {
    const neutron = new Neutron(
      col * cellSize + cellSize / 2,
      row * cellSize + cellSize / 2,
    )
    neutrons.value.push(neutron)
  }

  const fireNeutrons = (row, col, quantity) => {
    for (let i = 0; i < quantity; i++) {
      fireNeutron(row, col)
    }
  }

  // Explode uranium
  const explodeUranium = (row, col) => {
    if (getElement(row, col).type !== ELEMENT_TYPES.URANIUM) {
      return
    }

    // Make this element become inert
    replaceElement(row, col, new GridElement('inert', 'gray'))

    // Fire 3 neutrons in random directions.
    fireNeutrons(row, col, 3)
  }

  const getElement = (row, col) => {
    return gridElements.value[row][col] || null
  }

  const replaceElement = (row, col, newElement) => {
    gridElements.value[row][col] = newElement
  }

  const reset = () => {
    console.log('Resetting!')

    neutrons.value = []
    gridElements.value = Array.from({ length: rows }, () =>
      Array.from(
        { length: columns },
        () => new GridElement(ELEMENT_TYPES.URANIUM, 'rgb(37,99,235)'),
      ),
    )
  }

  return {
    canvasRef,
    rows,
    columns,
    cellSize,
    gridElements,
    neutrons,
    explodeUranium,
    initialize,
    reset,
  }
})