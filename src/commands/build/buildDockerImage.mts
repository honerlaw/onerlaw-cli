import { logSuccess, runCommand } from '../../utils/index.mjs'
import { DOCKER_PLATFORM, NPM_TOKEN_SECRET_ID } from './constants.mjs'

export async function buildDockerImage(
  fullImageName: string,
  dockerfilePath: string,
  contextPath: string,
  noCache: boolean,
  npmToken: string | null
): Promise<void> {
  const args = [
    'build',
    ...(npmToken ? (['--secret', `id=${NPM_TOKEN_SECRET_ID}`] as const) : []),
    '--platform',
    DOCKER_PLATFORM,
    '-f',
    dockerfilePath,
    '-t',
    fullImageName,
    contextPath,
  ]

  if (noCache) {
    args.push('--no-cache')
  }

  logSuccess('Building Docker image...')
  const commandOptions = npmToken ? { env: { NPM_TOKEN: npmToken } } : {}
  await runCommand('docker', args, commandOptions)
}
