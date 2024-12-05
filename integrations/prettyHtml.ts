import { fileURLToPath } from 'node:url'

import type { AstroIntegration } from 'astro'
import fs from 'fs'
import { globSync } from 'glob'
import beautify, { type CoreBeautifyOptions } from 'js-beautify'
import path from 'path'

import { logInfo, logSuccess } from '../helpers/logging.js'

// Name of the integration
const name = 'astro-pretty-html'

// Pretty HTML Integration
const prettyHtml = (isEnabled: boolean): AstroIntegration => {
  const beautifyOptions: CoreBeautifyOptions = {
    indent_size: 2,
    preserve_newlines: false
  }

  return {
    name,
    hooks: {
      'astro:build:done': async ({ dir }) => {
        // Check if the integration is enabled
        if (!isEnabled) {
          return
        }

        logInfo({ title: name, message: 'HTML formatting...' })
        const startTime = Date.now()

        const distDir = fileURLToPath(dir)
        const files = globSync(path.join(distDir, `/**/*.html`))

        for (const file of files) {
          // Read and beautify HTML files
          const htmlContent = fs.readFileSync(file, 'utf-8')
          const formattedHtml = beautify.html(htmlContent, beautifyOptions)
          fs.writeFileSync(file, formattedHtml, 'utf-8')
          logSuccess({ message: `formatted: ${file}` })
        }

        const endTime = Date.now()
        logInfo({ message: `✓ HTML formatted successfully in ${endTime - startTime}ms.` })
      }
    }
  }
}

export default prettyHtml
