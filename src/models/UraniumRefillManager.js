import { ELEMENT_TYPES } from '@/constants'
import GridElement from './GridElement'
import { useGameEngineStore } from '@/stores/gameEngineStore'

class UraniumRefillManager {
  constructor(grid, targetRichness) {
    this.grid = grid // Reference to the main grid
    this.targetRichness = targetRichness // Target percentage of uranium cells
    this.refillInterval = null
    this.store = useGameEngineStore()

    console.log(this.store)
    console.log(typeof this.store.replaceElement)
  }

  startRefillProcess() {
    this.updateRichness() // Check richness and adjust timer accordingly

    // Set a regular check interval to assess uranium richness level
    this.refillInterval = setInterval(() => {
      this.updateRichness()
    }, 500) // Adjust every second, but adapt this to suit game speed
  }

  stopRefillProcess() {
    if (this.refillInterval) clearInterval(this.refillInterval)
  }

  updateRichness() {
    const currentRichness = this.calculateCurrentRichness()

    // If uranium is below target, refill at a rate proportional to the deficit
    if (currentRichness < this.targetRichness) {
      const deficit = this.targetRichness - currentRichness

      // Refill cells based on deficit
      this.refillUranium(deficit)
    }
  }

  calculateCurrentRichness() {
    const totalCells = this.grid.value.length * this.grid.value[0].length
    const uraniumCells = this.grid.value
      .flat()
      .filter(cell => cell.type === ELEMENT_TYPES.URANIUM.type).length

    return (uraniumCells / totalCells) * 100 // Returns as percentage
  }

  refillUranium(deficit) {
    const numCellsToRefill = Math.ceil(
      (deficit / 100) * this.grid.value.length * this.grid.value[0].length,
    )

    for (let i = 0; i < numCellsToRefill; i++) {
      const emptyCell = this.findEmptyCell()
      if (emptyCell) {
        const row = this.grid.value.findIndex(r => r.includes(emptyCell))
        const col = this.grid.value[row].indexOf(emptyCell)
        this.store.replaceElement(
          row,
          col,
          new GridElement(ELEMENT_TYPES.URANIUM),
        )
      }
    }
  }

  findEmptyCell() {
    // Gather all empty cells
    const emptyCells = this.grid.value
      .flat()
      .filter(cell => cell.type === ELEMENT_TYPES.INERT.type)

    // If no empty cells are found, return null
    if (emptyCells.length === 0) return null

    // Randomly select an empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    return emptyCells[randomIndex]
  }
}

export default UraniumRefillManager
