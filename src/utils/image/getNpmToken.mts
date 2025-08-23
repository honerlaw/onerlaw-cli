import { readFile, resolvePath } from '@/utils/index.mjs'
import os from 'os'
import { NPMRC_AUTH_TOKEN_PREFIX } from '@/commands/build/constants.mjs'

export async function getNpmToken(): Promise<string | null> {
  try {
    const npmrcPath = resolvePath(os.homedir(), '.npmrc')
    const npmrcContent = await readFile(npmrcPath)
    const tokenLine = npmrcContent
      .split('\n')
      .find(line => line.indexOf(NPMRC_AUTH_TOKEN_PREFIX) !== -1)

    if (!tokenLine) {
      return null
    }

    const token = tokenLine.split(NPMRC_AUTH_TOKEN_PREFIX)[1].trim()
    return token ? token : null
  } catch {
    return null
  }
}
