import * as fs from 'node:fs'
import * as https from 'node:https'

import type { AstroIntegration } from 'astro'
import { glob } from 'glob'
import { JSDOM } from 'jsdom'

interface GoogleFontsOptimizerOptions {
  maxChars?: number
  logDetails?: boolean
  injectLocalFont?: boolean
}

// Google Fonts CSSを取得する関数（ブラウザUser-Agentを使用）
async function fetchGoogleFontsCSS(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        // モダンブラウザのUser-Agentを送信してWOFF2フォーマットを取得
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/css,*/*;q=0.1'
      }
    }

    https
      .get(options, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          resolve(data)
        })
      })
      .on('error', reject)
  })
}

// CSSにlocal()を注入する関数（複数フォントファミリー対応）
function injectLocalFontIntoCSS(css: string): string {
  // 各@font-faceブロックを個別に処理
  return css.replace(/@font-face\s*\{[^}]*\}/gs, (fontFaceBlock) => {
    // font-familyプロパティを抽出
    const fontFamilyMatch = fontFaceBlock.match(/font-family:\s*['"]([^'"]+)['"]/)
    if (!fontFamilyMatch) {
      // font-familyが見つからない場合はそのまま返す
      return fontFaceBlock
    }

    const fontFamily = fontFamilyMatch[1]

    // srcプロパティにlocal()を注入（font-family名を使用）
    return fontFaceBlock.replace(/src:\s*url\(/, `src: local('${fontFamily}'), url(`)
  })
}

export default function googleFontsOptimizer(options: GoogleFontsOptimizerOptions = {}): AstroIntegration {
  const { maxChars = 1000, logDetails = true, injectLocalFont = true } = options

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

              for (const link of Array.from(googleFontsLinks)) {
                const href = link.getAttribute('href')
                if (!href) continue

                // 既にtextパラメータが含まれている場合はスキップ
                if (href.includes('&text=') || href.includes('?text=')) {
                  continue
                }

                // textパラメータを追加
                const encodedText = encodeURIComponent(optimizedText)
                const updatedHref = `${href}&text=${encodedText}`

                if (injectLocalFont) {
                  try {
                    // Google Fonts CSSを取得
                    const fontsCss = await fetchGoogleFontsCSS(
                      updatedHref.startsWith('http') ? updatedHref : `https://${updatedHref}`
                    )

                    // local()を注入（各font-familyを自動検出）
                    const modifiedCss = injectLocalFontIntoCSS(fontsCss)

                    // <link>タグを<style>タグに置き換え
                    const styleElement = document.createElement('style')
                    styleElement.textContent = modifiedCss

                    // linkタグの前に挿入してlinkタグを削除
                    link.parentNode?.insertBefore(styleElement, link)
                    link.remove()

                    hasChanges = true

                    if (logDetails) {
                      logger.info(`CSSに各font-familyのlocal()を注入しました`)
                    }
                  } catch (error) {
                    logger.warn(`CSS取得エラー、通常の方法にフォールバック: ${error}`)
                    // エラー時は従来通りlinkタグを更新
                    link.setAttribute('href', updatedHref)
                    hasChanges = true
                  }
                } else {
                  // injectLocalFont無効時は従来通りlinkタグを更新
                  link.setAttribute('href', updatedHref)
                  hasChanges = true
                }
              }

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
