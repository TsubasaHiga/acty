import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))

const zipArchive = async (targetDir: string, outputFileName: string) => {
  const zipPath = `${outputFileName}.zip`
  const output = fs.createWriteStream(path.join(__dirname, `../${zipPath}`))

  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`)
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })

  archive.pipe(output)
  archive.glob('**', {
    cwd: targetDir
  })

  await archive.finalize()

  return
}

;(async () => {
  const now = new Date()
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  const projectName = packageJson.name.toUpperCase()
  await zipArchive('dist', `${projectName}_ProdBuild_${date}`)
})()
