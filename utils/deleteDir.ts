import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * ディレクトリを削除する
 * @param targetPath 対象ディレクトリ
 * @param removePaths targetPathから削除するディレクトリ
 */
const deleteDir = (targetPath: string, removePaths: string[]) => {
  // targetPathを取得
  const targetDir = path.join(__dirname, '../' + targetPath)

  // targetPathが存在しない場合は処理を終了
  if (!fs.existsSync(targetDir)) return

  // targetPathからremovePathsを取得して削除
  removePaths.forEach((removePath) => {
    const removeDir = path.join(targetDir, removePath)

    // removeDirが存在しない場合は処理を終了
    if (!fs.existsSync(removeDir)) return

    // removeDirを削除
    fs.rm(removeDir, { recursive: true }, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`👉 Deleted ${removeDir}`)
      }
    })
  })
}

deleteDir('dist', [])
