import { existsSync } from 'node:fs'
import { parseLines, readInput } from 'io'

const input = await readInput('day-04')

const collectLines = (grid: string[][]): string[] => {
  const rows = grid.length
  const cols = grid[0].length

  const horizontal = Array.from({ length: rows }, (_, row) => grid[row].join(''))

  const vertical = Array.from({ length: cols }, (_, col) => {
    return Array.from({ length: rows }, (_, row) => grid[row][col]).join('')
  })

  const topLeftToBottomRight = [
    ...Array.from({ length: cols }, (_, startCol) => {
      let diagonal = ''
      let row = 0; let col = startCol
      while (row < rows && col < cols) {
        diagonal += grid[row][col]
        row++
        col++
      }
      return diagonal
    }),
    ...Array.from({ length: rows - 1 }, (_, startRow) => {
      let diagonal = ''
      let row = startRow + 1; let col = 0
      while (row < rows && col < cols) {
        diagonal += grid[row][col]
        row++
        col++
      }
      return diagonal
    }),
  ]

  const topRightToBottomLeft = [
    ...Array.from({ length: cols }, (_, startCol) => {
      let diagonal = ''
      let row = 0; let col = startCol
      while (row < rows && col >= 0) {
        diagonal += grid[row][col]
        row++
        col--
      }
      return diagonal
    }),
    ...Array.from({ length: rows - 1 }, (_, startRow) => {
      let diagonal = ''
      let row = startRow + 1; let col = cols - 1
      while (row < rows && col >= 0) {
        diagonal += grid[row][col]
        row++
        col--
      }
      return diagonal
    }),
  ]

  return [...horizontal, ...vertical, ...topLeftToBottomRight, ...topRightToBottomLeft]
}

const grid: string[][] = input.split('\n').map((line) => line.split(''))

export const part1 = () => {
  const lines = collectLines(grid)
  let count = 0

  for (const line of lines) {
    count += (line.match(/XMAS/g) || []).length
    count += (line.match(/SAMX/g) || []).length
  }
  return count
}

export const part2 = () => {
  let cnt = 0
  function checkSide(side1: string, side2: string, arr: string[]) {
    return side1 == arr[0] && side2 == arr[1]
  }
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 'A') {
        try {
          const topLeft = grid[i - 1][j - 1]
          const botRight = grid[i + 1][j + 1]
          const botLeft = grid[i + 1][j - 1]
          const topRight = grid[i - 1][j + 1]

          const rule2 = checkSide(topRight, botLeft, ['M', 'S']) || checkSide(topRight, botLeft, ['S', 'M'])
          const rule1 = checkSide(topLeft, botRight, ['M', 'S']) || checkSide(topLeft, botRight, ['S', 'M'])

          if (rule1 && rule2) { cnt++ }
        } catch (e) {

        }
      }
    }
  }

  return cnt
}
