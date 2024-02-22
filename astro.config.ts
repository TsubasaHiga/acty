import partytown from '@astrojs/partytown'
import prefetch from '@astrojs/prefetch'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import type { AstroUserConfig } from 'astro/config'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'
import merge from 'deepmerge'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { siteConfig } from './src/siteConfig'
import isProduction from './src/utils/isProduction'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// defaultConfig
const defaultConfig: AstroUserConfig = {
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    robotsTxt({
      host: siteConfig.siteDomain
    }),
    prefetch({ throttle: 3 }),
    partytown({
      // Adds dataLayer.push as a forwarding-event.
      config: {
        forward: ['dataLayer.push']
      }
    })
  ],

  // Site URL
  site: isProduction() ? siteConfig.siteUrl : 'https://example.com',

  // Base Path
  base: isProduction() ? siteConfig.basePath : '/',

  // server
  server: {
    host: true
  },

  // ビルド設定
  vite: {
    css: {
      devSourcemap: !isProduction(),
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "sass:map";
            @use "sass:math";
            @use "${__dirname}/src/styles/_variables.scss" as *;
            @use "${__dirname}/src/styles/_mixin.scss" as *;
          `
        }
      }
    },
    build: {
      emptyOutDir: true
    }
  }
}

// productionでのみ有効な設定
const productionConfig: AstroUserConfig = {
  vite: {
    // ビルド時にconsole.logやdebuggerを削除
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log']
    }
  }
}

// productionの時はisProductionをマージ
const config: AstroUserConfig = isProduction() ? merge(defaultConfig, productionConfig) : defaultConfig

// https://astro.build/config
export default defineConfig(config)
