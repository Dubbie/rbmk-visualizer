// src/models/ControlRod.js
class ControlRod {
  constructor(x, height) {
    this.x = x // x position of the control rod
    this.height = height // height of the control rod
    this.width = 6
  }

  draw(context) {
    context.fillStyle = 'rgba(90, 90, 90)' // Color of the control rod
    context.fillRect(this.x - this.width / 2, 0, this.width, this.height) // Draw the rod
  }

  // Adjust the height of the control rod
  setHeight(height) {
    this.height = height
  }
}

export default ControlRod
