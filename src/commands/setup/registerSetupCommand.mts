import { Command } from 'commander'
import { logSuccess, logError } from '../../utils/index.mjs'
import { ENVIRONMENT_OPTION } from '../../utils/options.mjs'
import { setupAction } from './setupAction.mjs'
import { resolveConfig } from '@/config/resolve.mjs'
import { Config } from '@/config/index.mjs'

// so we can make everything optional, and then load the config file,
// and then merge the two, anything defined in the options overrides the config file
// we then need the "actual" schema to validate the final output
// would this just be the same as the config file? yes it would
export function registerSetupCommand(program: Command): void {
  program
    .command('setup')
    .description(`Setup backend configuration and terraform.tfvars`)
    .option('-p, --project <project-id>', 'Google Cloud Project ID')
    .addOption(ENVIRONMENT_OPTION)
    .option('-n, --environment-name <name>', 'environment name')
    .option('--database-name <name>', 'database name (optional)')
    .option('--database-user <user>', 'database user (optional)')
    .action(
      async (options: {
        project?: string
        environment?: Config['environment']
        environmentName?: string
        databaseName?: string
        databaseUser?: string
      }) => {
        const config = await resolveConfig(options)

        try {
          await setupAction(config)
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
