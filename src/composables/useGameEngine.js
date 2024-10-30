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
    neutrons.value.forEach(neutron => {
      context.fillStyle = 'white'
      context.beginPath()
      context.arc(neutron.x, neutron.y, 5, 0, Math.PI * 2)
      context.fill()
      context.closePath()
      neutron.x += neutron.directionX * slowNeutronSpeed
      neutron.y += neutron.directionY * slowNeutronSpeed

      // Check for collision (you can adjust this logic)
      if (
        Math.abs(neutron.x - neutron.targetX) < 5 &&
        Math.abs(neutron.y - neutron.targetY) < 5
      ) {
        // Handle collision (e.g., remove neutron)
        neutrons.value.splice(neutrons.value.indexOf(neutron), 1)
      }
    })

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
