import { Command } from 'commander'
import { logSuccess, logError } from '@/utils/index.mjs'
import { secretAction } from './secretAction.mjs'
import { type SecretOptions } from './types.mjs'
import { loadConfigFromPrompt } from '@/config/loadConfigFromPrompt.mjs'

type SecretCommandOptions = Pick<SecretOptions, 'secretName' | 'secretValue'>

export function registerSecretCommand(program: Command): void {
  program
    .command('secret')
    .description('Create or update a Google Cloud secret')
    .requiredOption(
      '-s, --secret-name <secret-name>',
      'Name of the secret (without environment prefix)'
    )
    .requiredOption('-v, --secret-value <secret-value>', 'Value of the secret')
    .action(async (options: SecretCommandOptions) => {
      try {
        const config = await loadConfigFromPrompt()
        await secretAction({
          project: config.selection.project,
          secretName: options.secretName,
          secretValue: options.secretValue,
          environment: config.selection.environment,
          environmentName: config.selection.environmentName,
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
