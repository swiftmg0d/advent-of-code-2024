import { parseLines, readInput } from 'io'

const input = await readInput('day-06')

export const part1 = () => {
  const lines = parseLines(input)
  const grid: string[][] = []
  const copyGrid: string[][] = []

  lines.forEach((line) => {
    grid.push(line.split(''))
    copyGrid.push(line.split(''))
  })
  const visitedCoordinates: Set<string> = new Set()

  const directionMap = new Map([
    ['>', [0, 1]],
    ['^', [-1, 0]],
    ['v', [1, 0]],
    ['<', [0, -1]],
  ])

  const turnAround = new Map([
    ['>', 'v'],
    ['^', '>'],
    ['v', '<'],
    ['<', '^'],
  ])

  const directions = ['>', '^', 'v', '<']

  let guard = null
  const rows = grid.length
  const cols = grid[0].length

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (directions.includes(grid[row][col])) {
        guard = [grid[row][col], [row, col]]
        break
      }
    }
    if (guard) { break }
  }

  visitedCoordinates.add(`${guard[1][0]},${guard[1][1]}`)

  let isOut = false
  while (!isOut) {
    const [currentDirection, currentPosition] = guard
    const movePosition = directionMap.get(currentDirection)
    const newPosition = [
      currentPosition[0] + movePosition[0],
      currentPosition[1] + movePosition[1],
    ]

    if (
      newPosition[0] < 0
      || newPosition[1] < 0
      || newPosition[0] >= rows
      || newPosition[1] >= cols
    ) {
      isOut = true
    } else {
      const cell = grid[newPosition[0]][newPosition[1]]
      if (cell !== '#') {
        visitedCoordinates.add(`${newPosition[0]},${newPosition[1]}`)
        guard[1] = newPosition
      } else {
        guard[0] = turnAround.get(currentDirection)
      }
    }
  }

  console.log(visitedCoordinates.size)
  return visitedCoordinates.size
}

export const part2 = () => {
  const lines = parseLines(input)
  const grid: string[][] = []
  lines.forEach((line) => grid.push(line.split('')))

  const directionMap = new Map([
    ['>', [0, 1]],
    ['^', [-1, 0]],
    ['v', [1, 0]],
    ['<', [0, -1]],
  ])

  const turnAround = new Map([
    ['>', 'v'],
    ['^', '>'],
    ['v', '<'],
    ['<', '^'],
  ])

  const directions = ['>', '^', 'v', '<']
  const rows = grid.length
  const cols = grid[0].length

  let startGuard = null
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (directions.includes(grid[row][col])) {
        startGuard = [grid[row][col], [row, col]]
        break
      }
    }
    if (startGuard) { break }
  }

  const moveGuard = (guard, grid) => {
    const visited = new Set()
    let isOut = false

    while (!isOut) {
      const [currentDirection, currentPosition] = guard
      const move = directionMap.get(currentDirection)
      const newPosition = [
        currentPosition[0] + move[0],
        currentPosition[1] + move[1],
      ]

      if (
        newPosition[0] < 0
        || newPosition[1] < 0
        || newPosition[0] >= rows
        || newPosition[1] >= cols
      ) {
        isOut = true
        break
      }

      const cell = grid[newPosition[0]][newPosition[1]]

      const state = `${newPosition[0]},${newPosition[1]},${currentDirection}`
      if (visited.has(state)) {
        return true
      }

      visited.add(state)

      if (cell !== '#') {
        guard[1] = newPosition
      } else {
        guard[0] = turnAround.get(currentDirection)
      }
    }

    return false
  }

  let obstructionCount = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === '.' && !(row === startGuard[1][0] && col === startGuard[1][1])) {
        grid[row][col] = '#'

        if (moveGuard([...startGuard], grid)) {
          obstructionCount++
        }

        grid[row][col] = '.'
      }
    }
  }

  console.log(obstructionCount)
  return obstructionCount
}
