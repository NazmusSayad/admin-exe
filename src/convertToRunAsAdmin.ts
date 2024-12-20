import path from 'path'
import fs from 'fs-extra'
import { spawnSync } from 'child_process'

const BIN_DIR = path.join(__dirname, '../bin')
const RESOURCE_HACKER_EXE = path.join(BIN_DIR, './ResourceHacker.exe')
const EXTRACTED_MANIFEST_DIR = path.resolve('./dist')
const EXTRACTED_MANIFEST = path.join(
  EXTRACTED_MANIFEST_DIR,
  './.extracted_manifest.xml'
)

function readManifest(filePath: string) {
  const fileBuffer = fs.readFileSync(filePath)
  const fileString = fileBuffer.toString('utf8')
  const manifestStart = fileString.indexOf('<?xml')
  const manifestEnd = fileString.indexOf('</assembly>') + '</assembly>'.length
  return fileString.slice(manifestStart, manifestEnd)
}

export default function (input: string, output: string) {
  if (!fs.existsSync(RESOURCE_HACKER_EXE)) {
    return console.error('ResourceHacker.exe not found')
  }

  if (!fs.existsSync(input)) {
    return console.error('Input exe not found:', input)
  }

  if (!fs.existsSync(EXTRACTED_MANIFEST_DIR)) {
    fs.mkdirSync(EXTRACTED_MANIFEST_DIR)
  }

  const manifest = readManifest(input)
  if (!manifest.includes('asInvoker')) {
    return console.log('Already has requireAdministrator')
  }

  fs.writeFileSync(
    EXTRACTED_MANIFEST,
    manifest.replace('asInvoker', 'requireAdministrator')
  )

  spawnSync(
    RESOURCE_HACKER_EXE,
    [
      '-open',
      input,
      '-save',
      output,
      '-action',
      'addoverwrite',
      '-res',
      EXTRACTED_MANIFEST,
      '-mask',
      'MANIFEST,1',
    ],
    { stdio: 'inherit' }
  )

  fs.unlinkSync(EXTRACTED_MANIFEST)
  console.log('Done')
}
