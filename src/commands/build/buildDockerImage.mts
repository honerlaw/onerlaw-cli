import { logSuccess, runCommand } from '../../utils/index.mjs'
import { DOCKER_PLATFORM, NPM_TOKEN_SECRET_ID } from './constants.mjs'

export async function buildDockerImage(
  fullImageName: string,
  dockerfilePath: string,
  contextPath: string,
  noCache: boolean,
  npmToken: string
): Promise<void> {
  const args = [
    'build',
    '--secret',
    `id=${NPM_TOKEN_SECRET_ID}`,
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
  await runCommand('docker', args, {
    env: {
      NPM_TOKEN: npmToken,
    },
  })
}
