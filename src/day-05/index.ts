import { debugPort } from 'node:process'
import { get } from 'node:http'
import { parseLines, readInput } from 'io'
import { validateDay } from '../utils/script'

const input = await readInput('day-05')

export const part1Utils = {
  getRulesAndExecutionOrder: (): [Array<string>, Array<string>] => {
    const arrRules: string[] = []
    const arrRuleExecution: string[] = []
    input.split('\n').forEach((line) => {
      if (line.length == 0) {} else if (line.match(/\d+\|\d+/g)) {
        arrRules.push(line)
      } else {
        arrRuleExecution.push(line)
      }
    })
    return [arrRules, arrRuleExecution]
  }
}

export const part1 = () => {
  const [arrRules, arrRuleExecution] = part1Utils.getRulesAndExecutionOrder()

  const arrTemp: string[] = []

  arrRuleExecution.forEach((line) => {
    let ruleCorrect = true
    line.split(',').forEach((value, index) => {
      if (index == 0) {}
      let previusNumber = index - 1
      while (previusNumber >= 0) {
        const rule = `${line.split(',')[index]}|${line.split(',')[previusNumber]}`
        if (arrRules.filter((value) => value == rule).length > 0) {
          ruleCorrect = false
        }
        previusNumber--
      }
    })
    if (ruleCorrect) {
      arrTemp.push(line)
    }
  })
  const result = arrTemp.map((value) => {
    const valuesSplited = value.split(',')
    const index = valuesSplited.length % 2 === 0 ? valuesSplited.length / 2 : Math.floor(valuesSplited.length / 2)
    return Number(valuesSplited[index])
  }).reduce((prev, curr) => {
    return prev + curr
  }, 0)
  return result
}

export const part2 = () => {
  const [arrRules, arrRuleExecution] = part1Utils.getRulesAndExecutionOrder()

  const arrWrongRules = new Map()

  arrRuleExecution.forEach((line) => {
    let ruleCorrect = true
    const rules: string[] = []

    line.split(',').forEach((value, index) => {
      if (index === 0) { return }
      let previousNumber = index - 1
      while (previousNumber >= 0) {
        const rule = `${line.split(',')[index]}|${line.split(',')[previousNumber]}`
        if (arrRules.includes(rule)) {
          rules.push(rule)
          ruleCorrect = false
        }
        previousNumber--
      }
    })

    if (!ruleCorrect) {
      arrWrongRules.set(line, rules)
    }
  })

  const inCorrectOrder = (x: string, y: string) => arrRules.includes(`${x}|${y}`)

  const sortUpdate = (update: string): [string[], number] => {
    const arr: string[] = update.split(',')
    arr.sort((a, b) => (inCorrectOrder(a, b) ? -1 : 1))
    return [arr, Math.floor(arr.length / 2)]
  }

  let result = 0
  arrWrongRules.forEach((value, key) => {
    const [sortedUpdate, index] = sortUpdate(key)
    result += Number(sortedUpdate[index])
  })
  console.log(result)
  return result
}
