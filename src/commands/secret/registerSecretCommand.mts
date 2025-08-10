import { Command } from 'commander'
import { logSuccess, logError } from '@/utils/index.mjs'
import { secretAction } from './secretAction.mjs'
import { type SecretOptions } from './types.mjs'
import { loadConfigFromPrompt } from '@/config/loadConfigFromPrompt.mjs'

type SecretCommandOptions = Pick<
  SecretOptions,
  'secretName' | 'secretValue'
> & { envFile?: string }

export function registerSecretCommand(program: Command): void {
  program
    .command('secret')
    .description('Create or update a Google Cloud secret')
    .option(
      '-s, --secret-name <secret-name>',
      'Name of the secret (without environment prefix)'
    )
    .option('-v, --secret-value <secret-value>', 'Value of the secret')
    .option('--env-file <path>', 'Path to a .env file with KEY=VALUE pairs')
    .action(async (options: SecretCommandOptions) => {
      try {
        const config = await loadConfigFromPrompt()
        const payload: SecretOptions = {
          project: config.selection.project,
          environment: config.selection.environment,
          environmentName: config.selection.environmentName,
        }

        if (options.envFile) {
          payload.envFilePath = options.envFile
        } else {
          if (!options.secretName || options.secretValue == null) {
            throw new Error(
              'Either provide --env-file or both --secret-name and --secret-value'
            )
          }
          payload.secretName = options.secretName
          payload.secretValue = options.secretValue
        }

        await secretAction(payload)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
