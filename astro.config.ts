import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import relativeLinks from 'astro-relative-links'
import robotsTxt from 'astro-robots-txt'
import merge from 'deepmerge'
import { loadEnv } from 'vite'

import imagesOptimize from './integrations/imagesOptimize'
import prettyHtml from './integrations/prettyHtml'
import { siteConfig } from './src/siteConfig'
import isProduction from './src/utils/isProduction'

type AstroUserConfig = typeof defineConfig extends (config: infer T) => any ? T : never

const { IGNORE_FOO } = loadEnv(process.env.NODE_ENV || '', process.cwd(), '')

// settings
const settings = {
  // enable prettyHtml
  prettyHtml: true
}

const toBoolean = (booleanStr: string | null): boolean => {
  return booleanStr ? booleanStr.toLowerCase() === 'true' : false
}

// sitemapで除外するページのリスト
const excludePages = [`${siteConfig.siteUrl}/contact/result/`]
// IGNORE_FOOがfalseの場合は/foo/をexcludePagesに追加
if (!toBoolean(IGNORE_FOO)) {
  excludePages.push(`${siteConfig.siteUrl}/foo/`)
}

// scss logger
const muteScssWarningList = [
  'mixed-decls',
  'legacy-js-api',
  'Sass @import rules are deprecated and will be removed in Dart Sass 3.0.0.'
]
const SCSS_Logger = {
  warn(message: any, options: any) {
    // Mute warning for muteScssWarningList
    if (options.deprecation && muteScssWarningList.some((mute) => message.includes(mute))) return
  }
}

// defaultConfig
const defaultConfig: AstroUserConfig = {
  integrations: [
    react(),
    tailwind(),
    relativeLinks(),
    prettyHtml(settings.prettyHtml),
    imagesOptimize(),
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

  // image
  image: {
    domains: ['placehold.jp']
  },
  compressHTML: !settings.prettyHtml,
  build: {
    inlineStylesheets: 'never'
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
            @use "src/styles/_variables.scss" as *;
            @use "src/styles/_mixin.scss" as *;
            @use "src/styles/_functions.scss" as *;
          `,
          logger: SCSS_Logger
        }
      }
    },
    ssr: {
      noExternal: ['umaki']
    },
    build: {
      minify: !settings.prettyHtml,
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
