import { runGcloudCommand } from '@/utils/index.mjs'

type SecretVersion = {
  name: string
  version: string
  state: string
  createTime?: string
}

export async function listSecretVersions(
  fullSecretName: string
): Promise<SecretVersion[]> {
  try {
    const output = await runGcloudCommand(
      ['secrets', 'versions', 'list', fullSecretName, '--format=json'],
      {},
      true
    )

    if (typeof output !== 'string') {
      throw new Error('Expected string output from gcloud command')
    }

    const versions = JSON.parse(output) as SecretVersion[]
    return versions
  } catch (error) {
    throw new Error(`Failed to list secret versions: ${error}`)
  }
}
