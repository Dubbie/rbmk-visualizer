// src/models/Neutron.js
class Neutron {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speed = 1 // Set speed
    // Randomize the direction
    const angle = Math.random() * 2 * Math.PI // Random angle in radians
    this.vx = this.speed * Math.cos(angle) // X velocity
    this.vy = this.speed * Math.sin(angle) // Y velocity
  }

  move() {
    this.x += this.vx // Update x position
    this.y += this.vy // Update y position
  }

  isOutOfBounds(canvasWidth, canvasHeight) {
    return (
      this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight
    )
  }

  draw(context) {
    context.fillStyle = 'white'
    context.beginPath()
    context.arc(this.x, this.y, 4, 0, Math.PI * 2)
    context.fill()
    context.closePath()
  }
}

export default Neutron
