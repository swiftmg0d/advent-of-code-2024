import { parseLines, readInput } from 'io'

const input = await readInput('day-02')

export const part1 = () => {
  const lines = parseLines(input)

  const arr: Array<Array<string>> = lines
    .map((value) => value.split(' '))

  let sum = 0

  type Model = {
    above: boolean
    isAsc: Array<boolean>
    isDes: Array<boolean>
  }

  function checkConstraints(rules: Model, value: string[]) {
    value.forEach((curr, index) => {
      const nextNumber = index + 1

      if (nextNumber < value.length) {
        const firstNumber = Number(curr)
        const secondNumber = Number(value[nextNumber])
        const diff = Math.abs(firstNumber - secondNumber)

        firstNumber > secondNumber
          ? rules.isAsc.push(true)
          : rules.isAsc.push(false)

        firstNumber < secondNumber
          ? rules.isDes.push(true)
          : rules.isDes.push(false)

        // eslint-disable-next-line no-unused-expressions
        diff === 0 || diff > 3 ? (rules.above = true) : null
      }
    })
    return rules
  }

  function checkIsAsc0rDes(isAsc: Array<boolean>, isDes: Array<boolean>) {
    const rule1
    = isAsc.filter((value) => value === true).length === isAsc.length
    && isDes.filter((value) => value === false).length === isDes.length
    const rule2
    = isDes.filter((value) => value === true).length === isDes.length
    && isAsc.filter((value) => value === false).length === isAsc.length

    return rule1 || rule2
  }

  function isSafe(value: string[]): boolean {
    const rules: Model = {
      above: false,
      isAsc: [],
      isDes: [],
    }

    checkConstraints(rules, value)

    if (rules.above === false && checkIsAsc0rDes(rules.isAsc, rules.isDes)) {
      return true
    }
    return false
  }

  arr.forEach((value) => {
    if (isSafe(value)) {
      sum += 1
    }
  })
  return sum
}

export const part2 = () => {
  const lines = parseLines(input)

  const arr: Array<Array<string>> = lines
    .map((value) => value.split(' '))

  let sum = 0

  type Model = {
    above: boolean
    isAsc: Array<boolean>
    isDes: Array<boolean>
  }

  function checkConstraints(rules: Model, value: string[]) {
    value.forEach((curr, index) => {
      const nextNumber = index + 1

      if (nextNumber < value.length) {
        const firstNumber = Number(curr)
        const secondNumber = Number(value[nextNumber])
        const diff = Math.abs(firstNumber - secondNumber)

        firstNumber > secondNumber
          ? rules.isAsc.push(true)
          : rules.isAsc.push(false)

        firstNumber < secondNumber
          ? rules.isDes.push(true)
          : rules.isDes.push(false)

        // eslint-disable-next-line no-unused-expressions
        diff === 0 || diff > 3 ? (rules.above = true) : null
      }
    })
    return rules
  }

  function checkIsAsc0rDes(isAsc: Array<boolean>, isDes: Array<boolean>) {
    const rule1
    = isAsc.filter((value) => value === true).length === isAsc.length
    && isDes.filter((value) => value === false).length === isDes.length
    const rule2
    = isDes.filter((value) => value === true).length === isDes.length
    && isAsc.filter((value) => value === false).length === isAsc.length

    return rule1 || rule2
  }

  function isSafe(value: string[]): boolean {
    const rules: Model = {
      above: false,
      isAsc: [],
      isDes: [],
    }

    checkConstraints(rules, value)

    if (rules.above === false && checkIsAsc0rDes(rules.isAsc, rules.isDes)) {
      return true
    } else {
      for (let i = 0; i < value.length; i++) {
        const newRules: Model = {
          above: false,
          isAsc: [],
          isDes: [],
        }
        const newValue = value.filter((_, index) => index !== i)

        checkConstraints(newRules, newValue)

        if (
          newRules.above === false
        && checkIsAsc0rDes(newRules.isAsc, newRules.isDes)
        ) {
          return true
        }
      }
    }
    return false
  }

  arr.forEach((value) => {
    if (isSafe(value)) {
      sum += 1
    }
  })
  return sum
}
