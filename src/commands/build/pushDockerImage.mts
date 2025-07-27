import { logSuccess, runCommand } from '../../utils/index.mjs'

export async function pushDockerImage(fullImageName: string): Promise<void> {
  logSuccess('Pushing Docker image to gcr.io...')
  await runCommand('docker', ['push', fullImageName])
}
