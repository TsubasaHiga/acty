import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import type { AstroUserConfig } from 'astro/config'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'
import merge from 'deepmerge'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { loadEnv } from 'vite'

import { siteConfig } from './src/siteConfig'
import isProduction from './src/utils/isProduction'
import ToBoolean from './src/utils/toBoolean'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { IGNORE_FOO } = loadEnv(process.env.NODE_ENV || '', process.cwd(), '')

// sitemapで除外するページのリスト
const excludePages = [`${siteConfig.siteUrl}/contact/result/`]
// IGNORE_FOOがfalseの場合は/foo/をexcludePagesに追加
if (!ToBoolean(IGNORE_FOO)) {
  excludePages.push(`${siteConfig.siteUrl}/foo/`)
}

// defaultConfig
const defaultConfig: AstroUserConfig = {
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page: string) => !excludePages.includes(page)
    }),
    robotsTxt({
      host: siteConfig.siteDomain
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

  // prefetch
  prefetch: {
    prefetchAll: true
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
            @use "${__dirname}/src/styles/_functions.scss" as *;
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
