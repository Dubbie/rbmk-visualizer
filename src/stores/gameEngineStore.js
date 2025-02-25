// src/stores/gameEngineStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  ELEMENT_TYPES,
  HEATING_RATE,
  RICHNESS,
  TARGET_NEUTRON_COUNT,
} from '@/constants'
import GridElement from '@/models/GridElement'
import Neutron from '@/models/Neutron'
import ControlRod from '@/models/ControlRod'
import UraniumRefillManager from '@/models/UraniumRefillManager'

export const useGameEngineStore = defineStore('gameEngine', () => {
  const richness = RICHNESS
  const columns = 40
  const rows = 21
  const cellSize = 30
  const neutrons = ref([])
  const canvasRef = ref(null)
  const gridElements = ref(
    Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => null),
    ),
  )
  const controlRods = ref([])
  let canvas = null
  let context = null
  let animationFrameId = null
  const isRunning = ref(true)
  const autoAdjustRods = ref(true)
  const rodOverrideDirection = ref(null)

  let uraniumRefillManager = null

  // Initialize the canvas and start the game loop
  const initialize = canvasParam => {
    canvas = canvasParam

    // Generate elements
    generateElements(richness)

    uraniumRefillManager = new UraniumRefillManager(gridElements, richness)
    uraniumRefillManager.startRefillProcess()

    if (canvas) {
      context = canvas.getContext('2d')
      drawGrid()
      createControlRods(10)
      requestAnimationFrame(gameLoop)
      setupVisibilityChangeHandler()
      startDecayForInertElements()
    }
  }

  const createControlRods = quantity => {
    let x = cellSize * 2

    for (let i = 0; i < quantity; i++) {
      controlRods.value.push(new ControlRod(x, rows * cellSize))

      x += cellSize * 4
    }
  }

  // Draw the control rods
  const drawControlRods = () => {
    for (const rod of controlRods.value) {
      rod.draw(context) // Draw each control rod
    }
  }

  // Function to initiate decay for all inert elements
  const startDecayForInertElements = () => {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const element = getElement(row, col)
        if (element.type === ELEMENT_TYPES.INERT.type) {
          element.startDecay(() => fireNeutron(row, col))
        }
      }
    }
  }

  // Handle visibility change to pause/resume the game loop
  const setupVisibilityChangeHandler = () => {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning.value = false // Pause the game
        cancelAnimationFrame(animationFrameId) // Stop the game loop
      } else {
        isRunning.value = true // Resume the game
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
    if (!isRunning.value) return
    context.clearRect(0, 0, canvas.width, canvas.height) // Clear canvas
    drawGrid() // Redraw grid
    drawControlRods()

    // If neutrons get out of hand, bail out
    if (neutrons.value.length > 2000) {
      reset()
    }

    if (autoAdjustRods.value) {
      adjustControlRods()
    } else {
      switch (rodOverrideDirection.value) {
        case 'lift':
          liftRods()
          break
        case 'lower':
          lowerRods()
          break
        default:
          break
      }
    }

    // Draw each neutron
    for (let i = neutrons.value.length - 1; i >= 0; i--) {
      const neutron = neutrons.value[i]

      neutron.move() // Move the neutron

      // Check for collision with the grid element
      const col = Math.floor(neutron.x / cellSize)
      const row = Math.floor(neutron.y / cellSize)
      if (row >= 0 && row < rows && col >= 0 && col < columns) {
        const element = getElement(row, col)
        element.heatWater(HEATING_RATE)

        // Check if water absorbs this neutron
        if (element.water.absorbNeutron()) {
          neutrons.value.splice(i, 1) // Remove the neutron
          continue // Skip the rest of the loop for this neutron
        }

        if (element.type === ELEMENT_TYPES.URANIUM.type) {
          explodeUranium(row, col) // Explode uranium if neutron collides
          neutrons.value.splice(i, 1) // Remove the neutron
          continue // Skip the rest of the loop for this neutron
        }
      }

      // Check for collision with control rods
      for (const rod of controlRods.value) {
        if (
          neutron.x >= rod.x &&
          neutron.x <= rod.x + rod.width &&
          neutron.y <= rod.height
        ) {
          neutrons.value.splice(i, 1) // Remove the neutron if it collides with a control rod
          break // Exit the loop once a collision is detected
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
    if (!isRunning.value) return
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

  // Update the adjustControlRods function in useGameEngine.js
  const adjustControlRods = () => {
    const currentNeutronCount = neutrons.value.length

    // Determine if we need to lower or lift control rods
    const isReducingNeutrons = currentNeutronCount > TARGET_NEUTRON_COUNT

    if (rodOverrideDirection.value) {
      rodOverrideDirection.value = null
    }

    // Adjust control rods based on current neutron count
    controlRods.value.forEach((rod, index) => {
      if (index % 2 === 0) {
        // Adjust every second control rod
        if (isReducingNeutrons) {
          rod.lower() // Lower rod to reduce neutron count
        } else {
          rod.lift() // Lift rod to increase neutron count
        }
      }
    })
  }

  const liftRods = () => {
    if (autoAdjustRods.value) return

    controlRods.value.forEach(rod => {
      rod.lift()
    })
  }

  const lowerRods = () => {
    if (autoAdjustRods.value) return
    controlRods.value.forEach(rod => {
      rod.lower()
    })
  }

  const resetRods = () => {
    autoAdjustRods.value = true
    rodOverrideDirection.value = null

    controlRods.value.forEach(rod => {
      rod.height = rod.maxHeight
    })
  }

  const reset = () => {
    console.log('Resetting!')

    neutrons.value = []
    generateElements(richness)
    resetRods()
  }

  const stop = () => {
    isRunning.value = false
    cancelAnimationFrame(animationFrameId) // Stop the game loop
  }

  const start = () => {
    isRunning.value = true
    requestAnimationFrame(gameLoop) // Restart the game loop
  }

  return {
    canvasRef,
    rows,
    columns,
    cellSize,
    gridElements,
    neutrons,
    isRunning,
    autoAdjustRods,
    rodOverrideDirection,
    explodeUranium,
    initialize,
    replaceElement,
    reset,
    stop,
    start,
  }
})
