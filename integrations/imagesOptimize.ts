import { exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import type { AstroIntegration } from 'astro'

import { logError, logInfo } from '../helpers/logging.js'

// Name of the integration
const name = 'astro-images-optimize'

// Promisify the exec function
const execPromise = promisify(exec)

// Run the convert script once and wait for it to finish
const runConvertOnce = async (): Promise<void> => {
  logInfo({ title: name, message: 'Images converting...' })
  const startTime = Date.now()

  try {
    const { stdout, stderr } = await execPromise(
      'node --no-warnings=ExperimentalWarning --loader ts-node/esm scripts/convertImages.ts'
    )

    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)

    logInfo({ message: `✓ Images converted successfully in ${Date.now() - startTime}ms.` })
  } catch (error) {
    logError({ title: name, message: `Error converting images: ${error}` })
  }
}

// Start a background watcher process for incremental changes
const startWatcher = (): void => {
  const child = spawn(
    'node',
    ['--no-warnings=ExperimentalWarning', '--loader', 'ts-node/esm', 'scripts/convertImages.ts', '--watch-only'],
    {
      stdio: 'inherit',
      shell: true
    }
  )

  child.on('close', (code) => {
    if (code !== 0 && code !== null) {
      logError({ title: name, message: `convertImages watcher exited with code ${code}` })
    }
  })
}

// imagesOptimize
const imagesOptimize = (): AstroIntegration => {
  return {
    name,
    hooks: {
      'astro:build:start': async () => {
        await runConvertOnce()
      },
      'astro:server:setup': async () => {
        // 1) wait until all images are generated
        await runConvertOnce()
        // 2) then start the watcher in the background for incremental changes
        startWatcher()
      }
    }
  }
}

export default imagesOptimize
