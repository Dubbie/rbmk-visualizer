class GridElement {
  constructor(typeDefinition) {
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
