import { ELEMENT_TYPES } from '@/constants'

class GridElement {
  constructor(type, color) {
    if (!Object.values(ELEMENT_TYPES).includes(type)) {
      throw new Error(`Invalid element type: ${type}`)
    }
    this.type = type
    this.color = color
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
