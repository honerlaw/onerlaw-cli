import { logSuccess, runGcloudCommand } from '../../utils/index.mjs'
import { GCR_HOSTNAME } from './constants.mjs'

export async function configureDockerAuth(registryName: string): Promise<void> {
  logSuccess(`Configuring Docker authentication for ${registryName}...`)
  await runGcloudCommand(['auth', 'configure-docker', GCR_HOSTNAME, '--quiet'])
}
