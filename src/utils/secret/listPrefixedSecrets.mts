import { runCommand } from '@/utils/index.mjs'

export async function listPrefixedSecrets(prefix: string): Promise<string[]> {
  try {
    const output = await runCommand(
      'gcloud',
      ['secrets', 'list', '--format=value(name)'],
      {},
      true
    )

    const allSecretNames = String(output || '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    return allSecretNames.filter(name => name.startsWith(prefix))
  } catch {
    return []
  }
}
