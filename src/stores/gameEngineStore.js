// src/stores/gameEngineStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DEBUG, ELEMENT_TYPES } from '@/constants'
import GridElement from '@/models/GridElement'
import Neutron from '@/models/Neutron'

export const useGameEngineStore = defineStore('gameEngine', () => {
  const richness = 50
  const columns = 40
  const rows = 25
  const cellSize = 30
  const neutrons = ref([])
  const canvasRef = ref(null)
  const gridElements = ref(
    Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => null),
    ),
  )
  let canvas = null
  let context = null
  let animationFrameId = null
  let isRunning = true

  // Fuel regeneration
  const minUraniumTime = 200
  const maxUraniumTime = 2000

  // Initialize the canvas and start the game loop
  const initialize = canvasParam => {
    canvas = canvasParam

    // Generate elements
    generateElements(richness)

    if (canvas) {
      context = canvas.getContext('2d')
      drawGrid()
      requestAnimationFrame(gameLoop)
      setupVisibilityChangeHandler()
      scheduleRandomUranium()
    }
  }

  // Function to add uranium at a random position
  const addRandomUranium = () => {
    // Generate a random position within the grid
    const randomRow = Math.floor(Math.random() * rows)
    const randomCol = Math.floor(Math.random() * columns)

    // Check if the random position is already uranium; if so, skip adding
    if (
      gridElements.value[randomRow][randomCol].type !==
      ELEMENT_TYPES.URANIUM.type
    ) {
      gridElements.value[randomRow][randomCol] = new GridElement(
        ELEMENT_TYPES.URANIUM,
      )

      if (DEBUG) {
        console.log(`Added uranium at (${randomRow}, ${randomCol})`)
      }
    }

    // Schedule the next uranium addition
    scheduleRandomUranium()
  }

  // Function to schedule the next uranium addition
  const scheduleRandomUranium = () => {
    const randomDelay = Math.floor(
      Math.random() * (maxUraniumTime - minUraniumTime + 1) + minUraniumTime,
    )
    setTimeout(addRandomUranium, randomDelay)
  }

  // Handle visibility change to pause/resume the game loop
  const setupVisibilityChangeHandler = () => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning = false // Pause the game
        cancelAnimationFrame(animationFrameId) // Stop the game loop
      } else {
        isRunning = true // Resume the game
        requestAnimationFrame(gameLoop) // Restart the game loop
      }
    })
  }

  const generateElements = uraniumRichnessPercentage => {
    gridElements.value = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => {
        const isUranium = Math.random() < uraniumRichnessPercentage / 100 // Check if we should place uranium
        return new GridElement(
          isUranium ? ELEMENT_TYPES.URANIUM : ELEMENT_TYPES.INERT,
        )
      }),
    )
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
    if (!isRunning) return
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
        if (element.type === ELEMENT_TYPES.URANIUM.type) {
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
    if (getElement(row, col).type !== ELEMENT_TYPES.URANIUM.type) {
      return
    }

    // Make this element become inert
    replaceElement(row, col, new GridElement(ELEMENT_TYPES.INERT))

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
    generateElements(richness)
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
