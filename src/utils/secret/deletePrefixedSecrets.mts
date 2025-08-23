import {
  logSuccess,
  logWarning,
  runCommand,
  setGcloudProject,
} from '@/utils/index.mjs'
import { buildSecretPrefix } from '@/utils/secret/buildSecretPrefix.mjs'
import { type LoadedConfig } from '@/config/index.mjs'

export async function deletePrefixedSecrets(
  config: LoadedConfig
): Promise<void> {
  try {
    const { project, environment, environmentName } = config.selection
    // Ensure we are targeting the correct GCP project before listing/deleting
    await setGcloudProject(project)
    const prefix = buildSecretPrefix(environment, environmentName)
    logWarning(`Deleting secrets with prefix: ${prefix}`)

    const output = await runCommand(
      'gcloud',
      ['secrets', 'list', '--format=value(name)', '--project', project],
      {},
      true
    )

    const allSecretNames = String(output || '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    const secretsToDelete = allSecretNames.filter(name =>
      name.startsWith(prefix)
    )

    if (secretsToDelete.length === 0) {
      logWarning(
        'No secrets found with the specified prefix, skipping deletion'
      )
      return
    }

    for (const secretName of secretsToDelete) {
      try {
        logWarning(`Deleting secret: ${secretName}`)
        await runCommand('gcloud', [
          'secrets',
          'delete',
          secretName,
          '--quiet',
          '--project',
          project,
        ])
        logSuccess(`Deleted secret: ${secretName}`)
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logWarning(`Failed to delete secret ${secretName}: ${errorMessage}`)
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logWarning(`Failed to list or delete secrets: ${errorMessage}`)
  }
}
