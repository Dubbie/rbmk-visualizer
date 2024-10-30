import GridElement from '@/models/GridElement'
import Neutron from '@/models/Neutron'
import { ELEMENT_TYPES } from '@/constants'
import { ref } from 'vue'

export const useGameEngine = () => {
  const columns = 30 // Size of the grid
  const rows = 20
  const cellSize = 30 // Size of each cell
  const neutrons = ref([]) // Array to hold neutrons
  const canvasRef = ref(null) // Reference to the canvas element
  const gridElements = ref(
    Array.from({ length: rows }, () =>
      Array.from(
        { length: columns },
        () => new GridElement(ELEMENT_TYPES.URANIUM, 'rgb(37,99,235)'),
      ),
    ),
  )
  let context = null // Canvas 2D context

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
        const element = getElement(row, col)
        element.draw(context, col, row, cellSize)
      }
    }
  }

  // Game loop
  const gameLoop = () => {
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height) // Clear canvas
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
      if (
        neutron.isOutOfBounds(canvasRef.value.width, canvasRef.value.height)
      ) {
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
