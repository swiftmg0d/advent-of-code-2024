import { parseLines, readInput } from 'io'

const input = await readInput('day-07')

// export const part1Utils = {
//   ex: (ex: number): Array<number> => {

//   }
// }
const generateCombinations = (symbols: string[], times: number) => {
  const number0fCombinations = symbols.length ** (times)
  const combinations: string[][] = []
  for (let i = 0; i < number0fCombinations; i++) {
    const combination: Array<string> = []
    let temp = i
    for (let j = 0; j < times; j++) {
      combination.push(symbols[temp % symbols.length])
      temp = Math.floor(temp / symbols.length)
    }
    combinations.push(combination)
  }
  return combinations
}

const calculate = (combination: string[], arr: number[], targetNumber: number, part: 'P1' | 'P2') => {
  let sum = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (combination[i - 1] == '*') {
      sum *= arr[i]
    } else if (combination[i - 1] == '+') {
      sum += arr[i]
    } else {
      if (part === 'P2') {
        sum = Number(sum.toString() + arr[i].toString())
      }
    }
  }
  return sum === targetNumber
}
export const part1 = () => {
  const lines = parseLines(input)

  let amount = 0

  lines.forEach((line) => {
    const targetNumber: number = Number(line.split(':')[0])
    const arr: Array<number> = line.split(':')[1].trim().split(' ').map((i) => Number(i))

    const symbols: Array<string> = ['*', '+']
    const times = (arr.length - 1)
    const combinations: string[][] = generateCombinations(symbols, times)

    combinations.some((combination) => {
      if (calculate(combination, arr, targetNumber, 'P1')) {
        amount += targetNumber
        return true
      }
      return false
    })
  })

  return amount
}

export const part2 = () => {
  const lines = parseLines(input)

  let amount = 0

  lines.forEach((line) => {
    const targetNumber: number = Number(line.split(':')[0])
    const arr: Array<number> = line.split(':')[1].trim().split(' ').map((i) => Number(i))

    const symbols: Array<string> = ['*', '+', '||']
    const times = (arr.length - 1)
    const combinations: string[][] = generateCombinations(symbols, times)

    combinations.some((combination) => {
      if (calculate(combination, arr, targetNumber, 'P2')) {
        amount += targetNumber
        return true
      }
      return false
    })
  })
  return amount
}
