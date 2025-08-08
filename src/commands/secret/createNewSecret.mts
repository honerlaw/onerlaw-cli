import { logSuccess, runCommand } from '@/utils/index.mjs'
import { SECRET_REPLICATION_POLICY } from './constants.mjs'

export async function createNewSecret(fullSecretName: string): Promise<void> {
  logSuccess(`Creating new secret: ${fullSecretName}`)
  await runCommand('gcloud', [
    'secrets',
    'create',
    fullSecretName,
    '--replication-policy',
    SECRET_REPLICATION_POLICY,
  ])
}
