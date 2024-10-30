import { ELEMENT_TYPES, MAX_DECAY_TIME, MIN_DECAY_TIME } from '@/constants'
import Water from './Water'

class GridElement {
  constructor(typeDefinition, water = null) {
    // Check if typeDefinition is valid and has the necessary properties
    if (!typeDefinition || typeof typeDefinition !== 'object') {
      throw new Error('Invalid typeDefinition: Expected an object.')
    }

    if (!typeDefinition.type || !typeDefinition.color) {
      throw new Error(
        'Invalid typeDefinition: Missing type or color properties.',
      )
    }

    // Check if the provided type is a valid element type
    if (
      !Object.values(ELEMENT_TYPES).some(
        elem => elem.type === typeDefinition.type,
      )
    ) {
      throw new Error(
        `Invalid element type: ${typeDefinition.type}. Expected one of: ${Object.values(
          ELEMENT_TYPES,
        )
          .map(e => e.type)
          .join(', ')}.`,
      )
    }
    this.type = typeDefinition.type
    this.color = typeDefinition.color
    this.decayInterval = null

    this.water = water ? water : new Water()
  }

  draw(context, col, row, cellSize) {
    // Draw water background if it exists and hasn’t evaporated
    if (this.water && !this.water.isEvaporated()) {
      this.drawWater(context, col, row, cellSize)
    }

    if (this.color !== 'transparent') {
      context.fillStyle = this.color
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

  drawWater(context, col, row, cellSize) {
    const waterColor = this.water.getColor() // Get color based on temperature
    context.fillStyle = waterColor
    context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize) // Draw water as a background
  }

  heatWater(amount) {
    if (this.water && !this.water.isEvaporated()) {
      this.water.heat(amount) // Increase the temperature of water
    }
  }

  isWaterEvaporated() {
    return this.water && this.water.isEvaporated() // Check if water has evaporated
  }

  startDecay(fireNeutron) {
    if (this.type !== ELEMENT_TYPES.INERT.type) return

    // Clear any existing timer
    if (this.decayInterval) {
      clearInterval(this.decayInterval)
    }

    const scheduleNeutronFire = () => {
      if (this.type === ELEMENT_TYPES.INERT.type) {
        // Schedule the next decay event
        const randomDelay = Math.floor(
          Math.random() * (MAX_DECAY_TIME - MIN_DECAY_TIME + 1) +
            MIN_DECAY_TIME,
        ) // Random delay between 2-5 seconds
        this.decayInterval = setTimeout(() => {
          // Fire a neutron at a random interval
          fireNeutron()
          scheduleNeutronFire()
        }, randomDelay)
      }
    }

    scheduleNeutronFire() // Start the first decay event
  }

  stopDecay() {
    if (this.decayInterval) {
      clearTimeout(this.decayInterval)
      this.decayInterval = null // Clear the timer
    }
  }
}

export default GridElement
