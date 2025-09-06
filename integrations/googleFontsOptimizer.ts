import * as fs from 'node:fs'

import type { AstroIntegration } from 'astro'
import { glob } from 'glob'
import { JSDOM } from 'jsdom'

interface GoogleFontsOptimizerOptions {
  maxChars?: number
  logDetails?: boolean
}

export default function googleFontsOptimizer(options: GoogleFontsOptimizerOptions = {}): AstroIntegration {
  const { maxChars = 1000, logDetails = true } = options

  return {
    name: 'google-fonts-optimizer',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        logger.info('Google Fonts最適化を開始...')

        try {
          // HTMLファイルを取得
          const htmlFiles = await glob('**/*.html', {
            cwd: dir.pathname,
            absolute: true
          })

          if (htmlFiles.length === 0) {
            logger.warn('HTMLファイルが見つかりません')
            return
          }

          // 全HTMLファイルからテキストノードのみを抽出
          const extractedTexts = new Set<string>()

          for (const htmlFile of htmlFiles) {
            try {
              const htmlContent = fs.readFileSync(htmlFile, 'utf-8')
              const dom = new JSDOM(htmlContent)
              const document = dom.window.document

              // scriptとstyleタグを除去
              const scriptsAndStyles = document.querySelectorAll('script, style')
              scriptsAndStyles.forEach((element) => element.remove())

              // body要素のテキストコンテンツのみを取得（alt属性などは除外）
              const bodyElement = document.querySelector('body')
              if (bodyElement) {
                const textContent = bodyElement.textContent || ''

                // 文字ごとに分割してSetに追加
                for (const char of textContent) {
                  if (char.trim() && extractedTexts.size < maxChars) {
                    extractedTexts.add(char)
                  }
                }
              }

              // 最大文字数に達したら処理を終了
              if (extractedTexts.size >= maxChars) {
                if (logDetails) {
                  logger.info(`最大文字数 ${maxChars} に達したため、文字抽出を終了`)
                }
                break
              }
            } catch (error) {
              logger.warn(`ファイル ${htmlFile} の処理中にエラーが発生: ${error}`)
              continue
            }
          }

          // 抽出された文字列を作成
          const optimizedText = Array.from(extractedTexts).join('')

          if (optimizedText.length === 0) {
            logger.warn('抽出されたテキストがありません')
            return
          }

          if (logDetails) {
            logger.info(`抽出された文字数: ${optimizedText.length}`)
            logger.info(`抽出された全文字: ${optimizedText}`)
          }

          // 各HTMLファイルのGoogle Fontsリンクを更新
          let processedFiles = 0
          for (const htmlFile of htmlFiles) {
            try {
              const htmlContent = fs.readFileSync(htmlFile, 'utf-8')
              const dom = new JSDOM(htmlContent)
              const document = dom.window.document

              // Google Fontsのlinkタグを取得
              const googleFontsLinks = document.querySelectorAll('link[href*="fonts.googleapis.com/css2"]')
              let hasChanges = false

              googleFontsLinks.forEach((link) => {
                const href = link.getAttribute('href')
                if (!href) return

                // 既にtextパラメータが含まれている場合はスキップ
                if (href.includes('&text=') || href.includes('?text=')) {
                  return
                }

                // textパラメータを追加
                const encodedText = encodeURIComponent(optimizedText)
                const updatedHref = `${href}&text=${encodedText}`
                link.setAttribute('href', updatedHref)
                hasChanges = true
              })

              // 変更があった場合のみファイルを更新
              if (hasChanges) {
                const updatedHtml = dom.serialize()
                fs.writeFileSync(htmlFile, updatedHtml, 'utf-8')
                processedFiles++
              }
            } catch (error) {
              logger.warn(`ファイル ${htmlFile} の更新中にエラーが発生: ${error}`)
              continue
            }
          }

          logger.info(`Google Fonts最適化完了: ${processedFiles}ファイル処理済み`)
        } catch (error) {
          logger.error(`Google Fonts最適化中にエラーが発生: ${error}`)
        }
      }
    }
  }
}
