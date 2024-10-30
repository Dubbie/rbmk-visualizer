// src/composables/useGameEngine.js
import { ref } from 'vue'

export const useGameEngine = () => {
  const columns = 30 // Size of the grid
  const rows = 20
  const cellSize = 30 // Size of each cell
  const neutrons = ref([]) // Array to hold neutrons
  const canvasRef = ref(null) // Reference to the canvas element
  const gridElements = ref(
    Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => 'uranium'),
    ),
  )
  let context = null // Canvas 2D context

  // Speeds
  const slowNeutronSpeed = 2

  // Initialize the canvas and start the game loop
  const initialize = canvas => {
    canvasRef.value = canvas.value

    if (canvasRef.value) {
      console.log('Initializing!')

      context = canvasRef.value.getContext('2d')
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
        drawElement(col, row, getElement(row, col))
      }
    }
  }

  const drawElement = (col, row, element) => {
    let color
    switch (element) {
      case 'uranium':
        color = 'rgb(37, 99, 235)'
        break
      case 'inert':
        color = 'gray'
        break
      case 'xenon':
        color = 'darkgray'
        break
      case 'empty':
        color = 'transparent' // This will effectively not draw anything
        break
      default:
        color = 'transparent'
    }

    if (color !== 'transparent') {
      context.fillStyle = color
      context.beginPath()
      context.arc(
        col * cellSize + cellSize / 2,
        row * cellSize + cellSize / 2,
        cellSize / 4,
        0,
        Math.PI * 2,
      )
      context.fill()
      context.closePath()
    }
  }

  // Game loop
  const gameLoop = () => {
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height) // Clear canvas
    drawGrid() // Redraw grid

    // Draw each neutron
    for (let i = neutrons.value.length - 1; i >= 0; i--) {
      const neutron = neutrons.value[i]

      // Draw neutron
      context.fillStyle = 'white'
      context.beginPath()
      context.arc(neutron.x, neutron.y, 5, 0, Math.PI * 2)
      context.fill()
      context.closePath()

      // Update neutron position based on direction
      neutron.x += neutron.directionX * slowNeutronSpeed // Move in x direction
      neutron.y += neutron.directionY * slowNeutronSpeed // Move in y direction

      // Check for collisions with uranium
      const col = Math.floor(neutron.x / cellSize)
      const row = Math.floor(neutron.y / cellSize)

      if (col >= 0 && col < columns && row >= 0 && row < rows) {
        if (getElement(row, col) === 'uranium') {
          explodeUranium(row, col) // Trigger explosion
          neutrons.value.splice(i, 1) // Remove neutron after explosion
          continue // Skip the rest of this iteration
        }
      }

      // Remove neutrons that go out of the canvas
      if (
        neutron.x < 0 ||
        neutron.x > canvasRef.value.width ||
        neutron.y < 0 ||
        neutron.y > canvasRef.value.height
      ) {
        neutrons.value.splice(i, 1)
      }
    }

    requestAnimationFrame(gameLoop) // Continue the loop
  }

  // Fire a neutron
  const fireRandomNeutron = (row, col) => {
    const angle = Math.random() * Math.PI * 2 // Random angle in radians
    const neutron = {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
      directionX: Math.cos(angle),
      directionY: Math.sin(angle),
    }
    neutrons.value.push(neutron)
  }

  const fireNeutrons = (row, col, quantity) => {
    for (let i = 0; i < quantity; i++) {
      fireRandomNeutron(row, col)
    }
  }

  // Explode uranium
  const explodeUranium = (row, col) => {
    if (getElement(row, col) !== 'uranium') {
      return
    }

    // Make this element become inert
    replaceElement(row, col, 'inert')

    // Fire 3 neutrons in random directions.
    fireNeutrons(row, col, 3)
  }

  const getElement = (row, col) => {
    return gridElements.value[row][col] || null
  }

  const replaceElement = (row, col, newElement) => {
    gridElements.value[row][col] = newElement
  }

  return {
    canvasRef,
    rows,
    columns,
    cellSize,
    gridElements,
    initialize,
    explodeUranium,
  }
}
