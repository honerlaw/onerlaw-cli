import { readFileUtf8, resolvePath } from '../../utils/index.mjs'
import os from 'os'
import { NPMRC_AUTH_TOKEN_PREFIX } from './constants.mjs'

export async function getNpmToken(): Promise<string> {
  const npmrcPath = resolvePath(os.homedir(), '.npmrc')
  const npmrcContent = await readFileUtf8(npmrcPath)
  const tokenLine = npmrcContent
    .split('\n')
    .find(line => line.startsWith(NPMRC_AUTH_TOKEN_PREFIX))

  if (!tokenLine) {
    throw new Error('NPM_TOKEN not found in ~/.npmrc file')
  }

  return tokenLine.split(NPMRC_AUTH_TOKEN_PREFIX)[1].trim()
}
