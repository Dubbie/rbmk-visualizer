import { ELEMENT_TYPES } from '@/constants'

class GridElement {
  constructor(typeDefinition) {
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
  }

  draw(context, col, row, cellSize) {
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
}

export default GridElement
