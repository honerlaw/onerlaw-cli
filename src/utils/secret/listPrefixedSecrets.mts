import { runGcloudCommand, setGcloudProject } from '@/utils/index.mjs'

export async function listPrefixedSecrets(
  prefix: string,
  project?: string
): Promise<string[]> {
  try {
    if (project) {
      await setGcloudProject(project)
    }
    const output = await runGcloudCommand(
      [
        'secrets',
        'list',
        '--format=value(name)',
        ...(project ? ['--project', project] : []),
      ],
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
