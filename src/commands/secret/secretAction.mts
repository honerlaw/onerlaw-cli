import { logSuccess, logError } from '@/utils/index.mjs'
import { type SecretOptions } from './types.mjs'
import { buildFullSecretName } from './buildFullSecretName.mjs'
import { setGcloudProject } from '@/utils/index.mjs'
import { createOrUpdateSecret } from './createOrUpdateSecret.mjs'

export async function secretAction(options: SecretOptions): Promise<void> {
  const { project, secretName, secretValue, environment, environmentName } =
    options

  const fullSecretName = buildFullSecretName(
    environment,
    environmentName,
    secretName
  )

  logSuccess(`Creating/updating secret: ${fullSecretName}`)

  try {
    await setGcloudProject(project)
    await createOrUpdateSecret(fullSecretName, secretValue)
    logSuccess(`Secret ${fullSecretName} created/updated successfully`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to create/update secret: ${errorMessage}`)
    throw new Error(`Failed to create/update secret: ${errorMessage}`)
  }
}
