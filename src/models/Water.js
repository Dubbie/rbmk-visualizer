import {
  ABSORPTION_CHANCE,
  COOLING_DELAY,
  COOLING_RATE,
  EVAPORATION_THRESHOLD,
} from '@/constants'

// src/models/Water.js
export default class Water {
  constructor() {
    this.temperature = 0 // Initial temperature
    this.maxTemperature = 100 // Max temperature before evaporation
    this.evaporated = false // State to check if the water has evaporated
  }

  heat(amount) {
    if (this.evaporated) return

    // Increase temperature and check for evaporation
    this.temperature += amount
    if (this.temperature >= EVAPORATION_THRESHOLD) {
      this.evaporated = true
      this.clearCooling()
    } else {
      this.restartCoolingTimer() // Restart cooling delay whenever heated
    }
  }

  restartCoolingTimer() {
    this.clearCooling() // Clear any existing cooling timer
    this.coolingInterval = setTimeout(() => this.startCooling(), COOLING_DELAY)
  }

  startCooling() {
    this.coolingInterval = setInterval(() => {
      if (this.temperature > 0) {
        this.temperature -= COOLING_RATE // Gradually cool water
      } else {
        this.clearCooling() // Stop cooling once temperature reaches 0
      }
    }, 1000) // Cooling interval, e.g., 1 second
  }

  clearCooling() {
    if (this.coolingInterval) {
      clearInterval(this.coolingInterval)
      this.coolingInterval = null
    }
  }

  absorbNeutron() {
    if (this.evaporated) return false // Can only absorb if not evaporated
    return Math.random() < ABSORPTION_CHANCE // Randomly absorb based on chance
  }

  isEvaporated() {
    return this.evaporated
  }

  getColor() {
    let colors = {
      red: 39,
      green: 39,
      blue: 42,
    }

    // Based on progress, let's make it lighter as it heats up
    const progress = Math.min(this.temperature / EVAPORATION_THRESHOLD, 1) + 1

    colors.red = progress * colors.red
    colors.green = progress * colors.green
    colors.blue = progress * colors.blue

    return `rgb(${colors.red},${colors.green},${colors.blue})`
  }

  getColorBackup() {
    const progress = Math.min(this.temperature / EVAPORATION_THRESHOLD, 1) // Normalize progress to 0-1
    const maxColorValue = 100

    // Calculate red and blue based on progress
    const red = 39 + progress * (maxColorValue - 39) // Increase red component
    const blue = maxColorValue - progress * (maxColorValue - 39) // Decrease blue component

    return `rgb(${Math.round(red)}, 39, ${Math.round(blue)})`
  }
}
