import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs/promises'
import { runCommand } from '@/utils/commands.mjs'

export async function addSecretVersion(
  fullSecretName: string,
  secretValue: string
): Promise<void> {
  const folderPath = path.resolve(os.homedir(), '.ocli', 'tmp')
  const filePath = path.resolve(folderPath, `${fullSecretName}.txt`)
  try {
    await fs.mkdir(folderPath, {
      recursive: true,
    })
    await fs.writeFile(filePath, secretValue)

    await runCommand('gcloud', [
      'secrets',
      'versions',
      'add',
      fullSecretName,
      `--data-file=${filePath}`,
    ])
  } finally {
    await fs.unlink(filePath)
  }
}
