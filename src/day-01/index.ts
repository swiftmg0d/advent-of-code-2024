import { parseLines, readInput } from 'io'

const input = await readInput('day-01')

export const part1 = () => {
  const lines = parseLines(input)

  type Model = {
    sum: number
    arr: Array<number>
  }

  const leftArray: Array<number> = lines
    .map((value) => Number(value.split(/\s+/)[0]))
    .sort((a, b) => b - a)

  const rightArray: Array<number> = lines
    .map((value) => Number(value.split(/\s+/)[1]))
    .sort((a, b) => a - b)

  const initivalValues: Model = {
    sum: 0,
    arr: rightArray.slice(),
  }

  const result = leftArray.reduce((prev: Model, curr) => {
    const poppedValue = prev.arr.pop() || 0
    return {
      sum: prev.sum + Math.abs(poppedValue - curr),
      arr: prev.arr,
    }
  }, initivalValues)

  return result.sum
}
export const part2 = () => {
  const lines = parseLines(input)

  const leftArray: Array<number> = lines
    .map((value) => Number(value.split(/\s+/)[0]))

  const rightArray: Array<number> = lines
    .map((value) => Number(value.split(/\s+/)[1]))

  const result = leftArray.reduce((prev, curr) => {
    const count = rightArray.filter((value) => value === curr).length
    return prev + curr * count
  }, 0)

  return result
}
