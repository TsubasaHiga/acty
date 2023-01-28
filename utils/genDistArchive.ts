import archiver from 'archiver'
import dayjs from 'dayjs'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))

const zipArchive = async (targetDir: string, outputFileName: string) => {
  const zipPath = `${outputFileName}.zip`
  const output = fs.createWriteStream(path.join(__dirname, '../' + zipPath))

  const archive = archiver('zip', {
    zlib: { level: 9 }
  })

  output.on('close', () => {
    console.log(archive.pointer() + ' total bytes')
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
  const date = dayjs().format('YYYYMMDD-HHmm')
  const projectName = packageJson.name.toUpperCase()
  await zipArchive('dist', `${projectName}_ProdBuild_${date}`)
})()
