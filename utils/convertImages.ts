import chokidar from 'chokidar'
import fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import sharp from 'sharp'
import type { Config } from 'svgo'
import { optimize } from 'svgo'

const inputDir: string = 'src/images'
const outputDir: string = 'public/assets/images'

// 画像の品質を設定
const sharpOptions = {
  quality: 70 // 画像の品質（0-100）
}

// SVGOの設定
const svgoOptions: Config = {
  plugins: [
    // ここにSVGOのプラグインを追加
    {
      name: 'cleanupIds',
      params: {
        force: true
      }
    },
    'collapseGroups',
    'convertShapeToPath',
    'convertStyleToAttrs',
    'mergePaths',
    'removeDoctype',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeComments',
    'removeDimensions',
    'removeEmptyAttrs',
    'removeMetadata',
    'removeXMLProcInst',
    'removeUnusedNS',
    'sortAttrs'
  ]
}

// 変換をSkipするファイルのPATHリスト
const skipFiles: [] = []

// ログメッセージを出力する関数
const logSuccess = (message: string) => console.log(`\x1b[32m${message}\x1b[0m`) // 緑色のテキスト
const logError = (message: string) => console.error(`\x1b[31m${message}\x1b[0m`) // 赤色のテキスト
const logInfo = (message: string) => console.info(`\x1b[34m${message}\x1b[0m`) // 青色のテキスト

/**
 * Cleans the output directory by removing all files and directories within it, and then recreating it.
 * @returns {void}
 */
const cleanOutputDir = (): void => {
  if (fs.existsSync(outputDir)) {
    fs.rmdirSync(outputDir, { recursive: true })
  }
  fs.mkdirSync(outputDir, { recursive: true })
  logInfo('Output directory cleaned.')
}

/**
 * Returns the output file path with the specified extension.
 * @param filePath - The input file path.
 * @param ext - The extension to use for the output file.
 * @returns The output file path.
 */
const getOutputFilePath = (filePath: string, ext: string): string => {
  const relativePath: string = path.relative(inputDir, filePath)
  return path.join(outputDir, relativePath.replace(/\..+$/, `.${ext}`))
}

/**
 * Processes a JPG or PNG image file and converts it to WebP format.
 * @param filePath - The path to the input image file.
 * @param outputFilePath - The path to the output WebP file.
 * @returns void
 */
const processJPGorPNG = (filePath: string, outputFilePath: string): void => {
  sharp(filePath)
    .toFormat('webp', sharpOptions)
    .toFile(outputFilePath)
    .then(() => logSuccess(`Processed: ${outputFilePath}`))
    .catch((err: Error) => logError(`Error processing ${filePath}: ${err}`))
}

/**
 * Compresses an SVG file and saves it to a specified output file path.
 * @param filePath - The file path of the SVG file to be compressed.
 * @param outputFilePath - The file path where the compressed SVG file will be saved.
 * @returns void
 */
const processSVG = (filePath: string, outputFilePath: string): void => {
  const data = fs.readFileSync(filePath, 'utf-8')
  const result = optimize(data, svgoOptions)
  if (result.data) {
    fs.writeFileSync(outputFilePath, result.data)
    logSuccess(`Compressed and saved SVG: ${outputFilePath}`)
  }
}

/**
 * copy file
 */
const copyFile = (filePath: string, outputFilePath: string): void => {
  fs.copyFileSync(filePath, outputFilePath)
  logInfo(`Copied file: ${outputFilePath}`)
}

/**
 * Processes the given file based on its extension.
 * @param filePath - The path of the file to be processed.
 * @returns void
 */
const processFile = (filePath: string): void => {
  // dot files are ignored
  if (path.basename(filePath).startsWith('.')) {
    return
  }

  // Skipするファイルかどうかを判定
  const isSkip = skipFiles.some((skipFile) => filePath.includes(skipFile))

  const ext: string = path.extname(filePath).toLowerCase()
  const outputFilePath: string = getOutputFilePath(
    filePath,
    ['.jpg', '.png'].includes(ext) && !isSkip
      ? // 拡張子が.jpgまたは.pngの場合は.webpに変換
        'webp'
      : ext.replace('.', '')
  )

  // ディレクトリを作成
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true })

  // Skipするファイルの場合はコピー
  if (isSkip) {
    copyFile(filePath, outputFilePath)
    return
  }

  switch (ext) {
    case '.jpg':
    case '.png':
      processJPGorPNG(filePath, outputFilePath)
      break
    case '.svg':
      processSVG(filePath, outputFilePath)
      break
    default:
      copyFile(filePath, outputFilePath)
      break
  }
}

/**
 * Deletes a file at the given input file path.
 * If the file exists, it will be deleted and a success message will be logged.
 * @param inputFilePath - The path to the file to be deleted.
 * @returns void
 */
const deleteFile = (inputFilePath: string): void => {
  const relativePath = path.relative(inputDir, inputFilePath)
  const outputFilePathWithoutExt = path.join(outputDir, relativePath.replace(/\..+$/, ''))

  // 削除するファイルの拡張子を決定
  let outputFilePath = ''
  if (['.jpg', '.jpeg', '.png'].includes(path.extname(inputFilePath).toLowerCase())) {
    outputFilePath = `${outputFilePathWithoutExt}.webp`
  } else if (path.extname(inputFilePath).toLowerCase() === '.svg') {
    outputFilePath = `${outputFilePathWithoutExt}.svg`
  } else {
    outputFilePath = `${outputFilePathWithoutExt}${path.extname(inputFilePath)}`
  }

  // ファイルが存在する場合は削除
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath)
    logSuccess(`Deleted: ${outputFilePath}`)
  }
}

/**
 * Processes all files in the input directory.
 * @returns A Promise that resolves when all files have been processed.
 */
const processAllFiles = async (): Promise<void> => {
  try {
    const files = await glob(`${inputDir}/**/*.*`)

    for (const file of files) {
      if (fs.lstatSync(file).isFile()) {
        processFile(file)
      }
    }
  } catch (err) {
    logError(`Error finding files: ${err}`)
  }
}

// --watchオプションが指定されているかどうかを判定
const shouldWatch = process.argv.includes('--watch')

// 出力ディレクトリをクリーン
cleanOutputDir()

// --watchオプションが指定されている場合はファイルの変更を監視
if (shouldWatch) {
  const watcher = chokidar.watch(`${inputDir}/**/*`, {
    persistent: true,
    ignoreInitial: false
  })

  watcher.on('add', processFile).on('unlink', deleteFile).on('change', processFile)

  logInfo('Watching for file changes...')
} else {
  // --watchオプションが指定されていない場合は一度だけファイルを処理
  processAllFiles()
}
