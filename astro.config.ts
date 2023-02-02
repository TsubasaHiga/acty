import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import { AstroUserConfig, defineConfig } from 'astro/config'

// isProduction
const isProduction = process.env.NODE_ENV === 'production'

const config: AstroUserConfig = {
  integrations: [react(), tailwind()],

  // サイト設定
  site: 'https://example.com',

  // ビルド設定
  vite: {
    css: {
      devSourcemap: !isProduction
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

// productionでのみ有効な設定をマージ
if (isProduction) {
  Object.assign(config, productionConfig)
}

// https://astro.build/config
export default defineConfig(config)
