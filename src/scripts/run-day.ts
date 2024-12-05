import process from 'node:process'
import fs from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import { formatDay, formatDayName, formatPerformance, validateDay, withPerformance } from 'utils/script'

// Path to save JSON results
const getResultsFilePath = () => path.resolve('./results.json') // Single JSON file for all days

const runDay = async (day: number, isDevMode?: boolean, isWatchMode?: boolean) => {
  if (!validateDay(day)) {
    console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
    console.log(`🎅 To get started, try: ${chalk.cyan('bun day 1')}`)
    return
  }

  const file = Bun.file(`./src/${formatDayName(day)}/index.ts`)
  const fileExists = await file.exists()

  if (!fileExists) {
    console.log(chalk.red(`Day ${formatDay(day)} does not exist!`))
    return
  }

  // Intercept console logs
  const originalLog = console.log
  const capturedLogs: string[] = []
  console.log = (...args) => {
    // eslint-disable-next-line unicorn/error-message
    const stack = new Error().stack
    const stackLine = stack?.split('\n')[2] // Usually, the third line contains the caller info
    const match = stackLine?.match(/\((.*):(\d+):(\d+)\)/) // Regex to extract file, line, and column
    const location = match ? `${match[1]}:${match[2]}` : 'unknown location'
    capturedLogs.push(`[${location}] ${args.join(' ')}`)
  }

  try {
    const { part1, part2 } = await import(`../${formatDayName(day)}/index.ts`)

    const [one, onePerformance] = withPerformance(() => part1?.())
    const [two, twoPerformance] = withPerformance(() => part2?.())

    const dayResults = {
      [`day${day}`]: {
        part1: {
          solved: !!one,
          date: one ? new Date().toUTCString() : null,
          performance: `${onePerformance.toFixed(2)} ms`
        },
        part2: {
          solved: !!two,
          date: two ? new Date().toUTCString() : null,
          performance: `${twoPerformance.toFixed(2)} ms`

        },
      },
    }

    if (!isWatchMode) {
      // Save results only if not in watch mode
      const resultsFilePath = getResultsFilePath()
      let allResults = {}

      try {
        const existingData = await fs.readFile(resultsFilePath, 'utf-8')
        allResults = JSON.parse(existingData) // Parse existing data
      } catch {
        console.log(chalk.yellow('Creating a new results.json file...'))
      }

      allResults = { ...allResults, ...dayResults }

      await fs.writeFile(resultsFilePath, JSON.stringify(allResults, null, 2))
      console.log(chalk.green(`✅ Results saved to ${resultsFilePath}`))
    }

    console.clear() // Clear console before printing results
    console.log = originalLog // Restore original console.log
    if (isWatchMode) {
      console.log('🖨️ Console Logs During Execution:')
      capturedLogs.forEach((log) => console.log(log))
    }

    if (!isWatchMode) {
      console.log(
        '🌲',
        'Part One:',
        chalk.green(one ?? '—'),
        one ? `(${formatPerformance(onePerformance)})` : ''
      )
      console.log(
        '🎄',
        'Part Two:',
        chalk.green(two ?? '—'),
        two ? `(${formatPerformance(twoPerformance)})` : ''
      )
    }
  } catch (error) {
    console.log = originalLog // Restore console.log in case of error
    console.error(chalk.red('❌ Error during execution:'), error)
  }
}

const day = Number(Bun.argv[2] ?? '')
const isDevMode = Bun.argv[3] === '--dev'
const isWatchMode = Bun.argv[3] === '--watch'

if (isWatchMode) {
  console.log(chalk.blue('🔁 Watch mode enabled...'))

  const dayName = formatDayName(day)
  const watcher = chokidar.watch(`./src/${dayName}/index.ts`, {
    persistent: true,
  })

  const reload = async () => {
    console.clear() // Clear console on every file change
    console.log(chalk.yellow(`♻️ Reloading Day ${day}...`))
    try {
      delete require.cache[require.resolve(`../${dayName}/index.ts`)] // Clear module cache
      await runDay(day, true, true)
    } catch (error) {
      console.error(chalk.red('❌ Error reloading file:'), error)
    }
  }

  watcher.on('change', reload).on('ready', () => {
    console.log(chalk.green('👀 Watching for file changes...'))
    reload()
  })

  process.on('SIGINT', () => {
    console.clear()
    console.log(chalk.red('🛑 Stopping watch mode.'))
    watcher.close()
    process.exit()
  })
} else {
  runDay(day, isDevMode, false)
}
