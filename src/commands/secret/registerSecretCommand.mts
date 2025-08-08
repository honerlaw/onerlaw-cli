import { Command } from 'commander'
import { logSuccess, logError } from '@/utils/index.mjs'
import { ENVIRONMENT_OPTION } from '@/utils/options.mjs'
import { secretAction } from './secretAction.mjs'
import { type SecretOptions } from './types.mjs'

type SecretCommandOptions = SecretOptions

export function registerSecretCommand(program: Command): void {
  program
    .command('secret')
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
    .action(async (options: SecretCommandOptions) => {
      try {
        await secretAction({
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
    })
}
