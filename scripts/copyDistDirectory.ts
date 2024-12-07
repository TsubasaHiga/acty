import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * ファイルをCopyする
 * @param source
 * @param target
 */
const copyFileSync = (source: string, target: string) => {
  fs.copyFileSync(source, target)
  console.log('Copied file: ' + target)
}

/**
 * ディレクトリをCopyする
 * @param source
 * @param target
 */
const copyDirectorySync = (source: string, target: string) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
    console.log('Created directory: ' + target)
  }
  const items = fs.readdirSync(source, { withFileTypes: true })

  for (const item of items) {
    const srcPath = path.join(source, item.name)
    const tgtPath = path.join(target, item.name)

    if (item.isDirectory()) {
      copyDirectorySync(srcPath, tgtPath)
    } else {
      copyFileSync(srcPath, tgtPath)
    }
  }
}

/**
 * ディレクトリを複数のディレクトリにコピーする
 * @param sourcePath コピー対象ディレクトリ
 * @param targetPaths sourcePathのコピー先ディレクトリ（存在しない場合は作成する）
 */
const copyToMultipleTargetsSync = (sourcePath: string, targetPaths: string[]) => {
  // sourcePathを取得
  const targetDir = path.join(__dirname, '../' + sourcePath)

  // sourcePathが存在しない場合は処理を終了
  if (!fs.existsSync(targetDir)) return

  // sourcePath（ディレクトリとファイルの全て）をtargetPathsにコピー
  targetPaths.forEach((targetPath) => {
    const copyDir = path.join(__dirname, '../' + targetPath)

    // copyDirが既に存在する場合はディレクトリ配下の全てのファイルをクリーンアップ
    if (fs.existsSync(copyDir)) {
      fs.rmSync(copyDir, { recursive: true })
    }

    // copyDirを作成
    fs.mkdirSync(copyDir)

    // targetDirからcopyDirにファイルをコピー
    copyDirectorySync(targetDir, copyDir)
  })
}

let sourcePath = 'dist'
let targetPaths = ['dist-stg']

// --source と --target の指定を取得
const args = process.argv.slice(2)
const source = args[0]
const targets = args[1]

// --source と --targets が指定されている場合はそれを優先する
if (source) sourcePath = source
if (targets) targetPaths = targets.split(',')

// コピー処理
copyToMultipleTargetsSync(sourcePath, targetPaths)
