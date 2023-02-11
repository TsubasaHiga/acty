import prefetch from '@astrojs/prefetch'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { AstroUserConfig, defineConfig } from 'astro/config'
import compress from 'astro-compress'
import merge from 'deepmerge'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { siteConfig } from './src/siteConfig'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// isProduction
const isProduction = process.env.NODE_ENV === 'production'

// defaultConfig
const defaultConfig: AstroUserConfig = {
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    prefetch({ throttle: 3 }),
    compress({
      css: false,
      html: true,
      img: false,
      js: false,
      svg: false
    })
  ],

  // Site URL
  site: isProduction ? siteConfig.siteUrl : 'https://example.com',

  // Base Path
  base: isProduction ? siteConfig.basePath : '/',

  // server
  server: {
    host: true
  },

  // ビルド設定
  vite: {
    css: {
      devSourcemap: !isProduction,
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
const config: AstroUserConfig = isProduction ? merge(defaultConfig, productionConfig) : defaultConfig

// https://astro.build/config
export default defineConfig(config)
