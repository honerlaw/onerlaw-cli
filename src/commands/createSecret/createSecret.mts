import { execSync } from 'child_process'
import {
  logSuccess,
  logWarning,
  logError,
  runCommand,
} from '../../utils/index.mjs'
import { Command } from 'commander'
import { ENVIRONMENT_OPTION } from '../../utils/options.mjs'

type CreateSecretOptions = {
  project: string
  secretName: string
  secretValue: string
  environment: string
  environmentName: string
}

async function createSecretAction(options: CreateSecretOptions): Promise<void> {
  const { project, secretName, secretValue, environment, environmentName } =
    options

  const fullSecretName = `${environment}-${environmentName}-${secretName}`

  logSuccess(`Creating/updating secret: ${fullSecretName}`)

  try {
    await runCommand('gcloud', ['config', 'set', 'project', project])

    // Check if secret exists
    try {
      await runCommand('gcloud', ['secrets', 'describe', fullSecretName])
      logWarning(`Secret ${fullSecretName} already exists, updating version...`)
    } catch {
      // Secret doesn't exist, create it
      logSuccess(`Creating new secret: ${fullSecretName}`)
      await runCommand('gcloud', [
        'secrets',
        'create',
        fullSecretName,
        '--replication-policy',
        'automatic',
      ])
    }

    execSync(
      `echo "${secretValue}" | gcloud secrets versions add ${fullSecretName} --data-file=-`
    )

    logSuccess(`Secret ${fullSecretName} created/updated successfully`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Failed to create/update secret: ${errorMessage}`)
    throw new Error(`Failed to create/update secret: ${errorMessage}`)
  }
}

export function registerCreateSecretCommand(program: Command): void {
  program
    .command('create-secret')
    .description('Create or update a Google Cloud secret')
    .requiredOption('-p, --project <project-id>', 'Google Cloud Project ID')
    .requiredOption(
      '-s, --secret-name <secret-name>',
      'Name of the secret (without environment prefix)'
    )
    .requiredOption('-v, --secret-value <secret-value>', 'Value of the secret')
    .addOption(ENVIRONMENT_OPTION.makeOptionMandatory(true))
    .requiredOption(
      '-n, --environment-name <environment-name>',
      'Environment name'
    )
    .action(
      async (options: {
        project: string
        secretName: string
        secretValue: string
        environment: string
        environmentName: string
      }) => {
        try {
          await createSecretAction({
            project: options.project,
            secretName: options.secretName,
            secretValue: options.secretValue,
            environment: options.environment,
            environmentName: options.environmentName,
          })
          logSuccess('Done!')
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          logError(`Error: ${errorMessage}`)
          process.exit(1)
        }
      }
    )
}
