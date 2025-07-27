import { Command } from 'commander'
import { logSuccess, logError } from '../../utils/index.mjs'
import { ENVIRONMENT_OPTION } from '../../utils/options.mjs'
import { setupAction } from './setupAction.mjs'

export function registerSetupCommand(program: Command): void {
  program
    .command('setup')
    .description(`Setup backend configuration and terraform.tfvars`)
    .requiredOption('-p, --project <project-id>', 'Google Cloud Project ID')
    .addOption(ENVIRONMENT_OPTION)
    .requiredOption('-n, --environment-name <name>', 'environment name')
    .option('--database-name <name>', 'database name (optional)')
    .option('--database-user <user>', 'database user (optional)')
    .action(
      async (options: {
        project: string
        environment: string
        environmentName: string
        databaseName?: string
        databaseUser?: string
      }) => {
        try {
          await setupAction(
            options.project,
            options.environment,
            options.environmentName,
            options.databaseName || null,
            options.databaseUser || null
          )
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
