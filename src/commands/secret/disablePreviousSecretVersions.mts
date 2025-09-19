import { logSuccess, runGcloudCommand } from '@/utils/index.mjs'
import { listSecretVersions } from './listSecretVersions.mjs'

export async function disablePreviousSecretVersions(
  fullSecretName: string
): Promise<void> {
  try {
    const versions = await listSecretVersions(fullSecretName)

    // Filter out already disabled versions and sort by version number (descending)
    const enabledVersions = versions
      .filter(version => version.state === 'ENABLED')
      .sort((a, b) => parseInt(b.version) - parseInt(a.version))

    // If there's only one enabled version or less, nothing to disable
    if (enabledVersions.length <= 1) {
      return
    }

    // Keep the latest version (first in sorted array) and disable all others
    const versionsToDisable = enabledVersions.slice(1)

    for (const version of versionsToDisable) {
      await runGcloudCommand([
        'secrets',
        'versions',
        'disable',
        version.version,
        '--secret',
        fullSecretName,
      ])
      logSuccess(
        `Disabled secret version ${version.version} for ${fullSecretName}`
      )
    }
  } catch (error) {
    throw new Error(`Failed to disable previous secret versions: ${error}`)
  }
}
