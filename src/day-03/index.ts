import { parseLines, readInput } from 'io'

const input = await readInput('day-03')

export const part1 = () => {
  const regex = /mul\((\d+),(\d+)\)/g

  let sum = 0

  for (const match of input.matchAll(regex)) {
    sum += Number(match[1]) * Number(match[2])
  }
  return sum
}

export const part2Utils = {
  getArr: (regex: RegExp): Array<number> => {
    const arr: Array<number> = []
    for (const match of input.matchAll(regex)) {
      arr.push(match.index)
    }
    return arr
  },
  getLastIndex: (arr: number[], match: RegExpExecArray): number => {
    return arr
      .filter((i) => i < match.index)
      .sort((a, b) => b - a)[0]
  }
}

export const part2 = () => {
  const regex = /mul\((\d+),(\d+)\)/g
  const doRegex = /do\(\)/g
  const dontRegex = /don't\(\)/g

  let sum = 0

  const dontArrIndex = part2Utils.getArr(dontRegex)
  const doArrIndex = part2Utils.getArr(doRegex)

  for (const match of input.matchAll(regex)) {
    const lastDoIndex = part2Utils.getLastIndex(doArrIndex, match)
    const lastDontIndex = part2Utils.getLastIndex(dontArrIndex, match)

    if (lastDontIndex === undefined || lastDoIndex > lastDontIndex) {
      sum += Number(match[1]) * Number(match[2])
    }
  }
  return sum
}
