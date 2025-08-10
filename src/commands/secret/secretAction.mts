import { logSuccess, logError } from '@/utils/index.mjs'
import { type SecretOptions } from './types.mjs'
import { buildFullSecretName } from './buildFullSecretName.mjs'
import { setGcloudProject } from '@/utils/index.mjs'
import { createOrUpdateSecret } from './createOrUpdateSecret.mjs'
import { parseEnvFile } from './parseEnvFile.mjs'

export async function secretAction(options: SecretOptions): Promise<void> {
  const { project, environment, environmentName, envFilePath } = options

  try {
    await setGcloudProject(project)

    if (envFilePath) {
      const envMap = await parseEnvFile(envFilePath)
      for (const [key, value] of Object.entries(envMap)) {
        const fullSecretName = buildFullSecretName(
          environment,
          environmentName,
          key
        )
        logSuccess(`Creating/updating secret: ${fullSecretName}`)
        await createOrUpdateSecret(fullSecretName, value)
        logSuccess(`Secret ${fullSecretName} created/updated successfully`)
      }
      return
    }

    const { secretName, secretValue } = options
    if (!secretName || typeof secretName !== 'string') {
      throw new Error('secretName is required when --env-file is not provided')
    }
    if (secretValue == null) {
      throw new Error('secretValue is required when --env-file is not provided')
    }

    const fullSecretName = buildFullSecretName(
      environment,
      environmentName,
      secretName
    )

    logSuccess(`Creating/updating secret: ${fullSecretName}`)
    await createOrUpdateSecret(fullSecretName, secretValue)
    logSuccess(`Secret ${fullSecretName} created/updated successfully`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to create/update secret(s): ${errorMessage}`)
    throw new Error(`Failed to create/update secret(s): ${errorMessage}`)
  }
}
