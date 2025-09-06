import path from 'node:path'

import chokidar from 'chokidar'
import fs from 'fs'
import { glob } from 'glob'
import sharp from 'sharp'
import type { Config } from 'svgo'
import { optimize } from 'svgo'

import { logError, logInfo, logSuccess } from '../helpers/logging.js'

const name = '[convertImages]'
const inputDir: string = 'src/images'
const outputDir: string = 'public/assets/images'

// 画像の品質を設定
const sharpOptions = {
  quality: 70 // Image quality (0-100)
}

// SVGOの設定
const svgoOptions: Config = {
  plugins: [
    // Add SVGO plugins here to optimize SVG files, such as removing unnecessary elements or attributes
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
    'removeMetadata',
    'removeXMLProcInst',
    'removeUnusedNS',
    'sortAttrs'
  ]
}

// List of file paths to skip conversion
const skipFiles: string[] = []

// List of files to format
type SharpFormatKey = keyof typeof sharp.format
const formatFiles: { [key: string]: SharpFormatKey } = {}

/**
 * Cleans the output directory by removing all files and directories within it, and then recreating it.
 * @returns {void}
 */
const cleanOutputDir = (): void => {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true })
  }
  fs.mkdirSync(outputDir, { recursive: true })
  logInfo({ message: `${name} Output directory cleaned.` })
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
 * Processes a JPG or PNG image file and converts it to the specified format.
 * @param filePath - The path to the input image file.
 * @param outputFilePath - The path to the output file.
 * @param format - The format to convert the image to.
 * @returns void
 */
const processImage = (filePath: string, outputFilePath: string, format: SharpFormatKey): void => {
  sharp(filePath)
    .toFormat(format, sharpOptions)
    .toFile(outputFilePath)
    .then(() => logSuccess({ message: `${name} Processed: ${outputFilePath}` }))
    .catch((err: Error) => logError({ message: `${name} [processImage] Error processing ${filePath}: ${err}` }))
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
    logSuccess({ message: `${name} Compressed and saved SVG: ${outputFilePath}` })
  }
}

/**
 * copy file
 */
const copyFile = (filePath: string, outputFilePath: string): void => {
  fs.copyFileSync(filePath, outputFilePath)
  logInfo({ message: `${name} Copied file: ${outputFilePath}` })
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

  // Determine if the file should be skipped
  const shouldSkip = skipFiles.some((skipFile) => filePath.includes(skipFile))

  const fileExtension: string = path.extname(filePath).toLowerCase()
  const format =
    formatFiles[filePath] ||
    (['.jpg', '.png'].includes(fileExtension) && !shouldSkip ? 'webp' : fileExtension.replace('.', ''))
  const outputFilePath: string = getOutputFilePath(filePath, format)

  // Create directory
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true })

  // If the file should be skipped, copy it
  if (shouldSkip) {
    copyFile(filePath, outputFilePath)
    return
  }

  switch (fileExtension) {
    case '.jpg':
    case '.png':
      processImage(filePath, outputFilePath, format as SharpFormatKey)
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

  // Determine the extension of the file to be deleted
  let outputFilePath = ''
  const format = formatFiles[inputFilePath] || path.extname(inputFilePath).toLowerCase().replace('.', '')
  if (['.jpg', '.jpeg', '.png'].includes(path.extname(inputFilePath).toLowerCase())) {
    outputFilePath = `${outputFilePathWithoutExt}.${format}`
  } else if (path.extname(inputFilePath).toLowerCase() === '.svg') {
    outputFilePath = `${outputFilePathWithoutExt}.svg`
  } else {
    outputFilePath = `${outputFilePathWithoutExt}${path.extname(inputFilePath)}`
  }

  // If the file exists, delete it
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath)
    logSuccess({ message: `${name} Deleted: ${outputFilePath}`, color: 'red' })
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
    logError({ message: `${name} Error finding files: ${err}` })
  }
}

// Determine if the --watch option is specified
const isWatchMode = process.argv.includes('--watch')

// Clean the output directory
cleanOutputDir()

// If the --watch option is specified, watch for file changes
if (isWatchMode) {
  const watcher = chokidar.watch(`${inputDir}/**/*`, {
    persistent: true,
    ignoreInitial: false
  })

  watcher.on('add', processFile).on('unlink', deleteFile).on('change', processFile)

  logInfo({ message: `${name} Watching for file changes...` })
} else {
  // If the --watch option is not specified, process the files once
  processAllFiles()
}
