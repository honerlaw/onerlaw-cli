import { logWarning } from '@/utils/index.mjs'
import { checkSecretExists } from './checkSecretExists.mjs'
import { createNewSecret } from './createNewSecret.mjs'
import { addSecretVersion } from './addSecretVersion.mjs'
// import { disablePreviousSecretVersions } from './disablePreviousSecretVersions.mjs'

export async function createOrUpdateSecret(
  fullSecretName: string,
  secretValue: string
): Promise<void> {
  const secretExists = await checkSecretExists(fullSecretName)

  if (!secretExists) {
    await createNewSecret(fullSecretName)
  } else {
    logWarning(`Secret ${fullSecretName} already exists, updating version...`)
  }

  await addSecretVersion(fullSecretName, secretValue)

  // Disable all previous versions for security
  if (secretExists) {
    // await disablePreviousSecretVersions(fullSecretName)
  }
}
