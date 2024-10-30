class ControlRod {
  constructor(x, maxHeight) {
    this.x = x // x position of the control rod
    this.maxHeight = maxHeight
    this.height = maxHeight // Start at the bottom (not lifted)
    this.width = 6
    this.speed = 0.1
  }

  draw(context) {
    context.fillStyle = 'rgba(90, 90, 90)' // Color of the control rod
    // Adjust y to be the maxHeight minus current height, so it draws upwards
    context.fillRect(this.x - this.width / 2, 0, this.width, this.height) // Draw the rod
  }

  lower() {
    if (this.height < this.maxHeight) {
      this.height = Math.min(this.maxHeight, this.height + this.speed) // Lower the rod by speed (increase height)
    }
  }

  lift() {
    if (this.height > 0) {
      this.height = Math.max(0, this.height - this.speed) // Lift the rod by speed (decrease height)
    }
  }
}

export default ControlRod
