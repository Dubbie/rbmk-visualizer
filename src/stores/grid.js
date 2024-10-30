import { defineStore } from 'pinia'

export const useGridStore = defineStore('grid', {
  state: () => ({
    rows: 10,
    columns: 10,
    grid: [],
  }),
  actions: {
    initializeGrid() {
      this.grid = Array.from(
        { length: this.rows },
        () => Array.from({ length: this.columns }, () => 'empty'), // Initialize with 'empty'
      )
    },
    setElement(row, col, element) {
      if (this.grid[row] && this.grid[row][col] !== undefined) {
        this.grid[row][col] = element
      }
    },
    setDimensions(rows, columns) {
      this.rows = rows
      this.columns = columns
      this.initializeGrid()
    },
  },
})
