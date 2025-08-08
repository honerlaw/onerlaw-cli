import { runCommand } from '@/utils/index.mjs'

export async function addSecretVersion(
  fullSecretName: string,
  secretValue: string
): Promise<void> {
  await runCommand('sh', [
    '-c',
    `echo "${secretValue}" | gcloud secrets versions add ${fullSecretName} --data-file=-`,
  ])
}
