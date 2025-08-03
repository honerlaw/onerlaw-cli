import { Command } from 'commander'
import { logSuccess, logError } from '@/utils/logger.mjs'
import { newConfigAction } from './newConfigAction.mjs'

export function registerConfigNewCommand(configCommand: Command): void {
  configCommand
    .command('new')
    .description('Create a new configuration')
    .action(async () => {
      try {
        await newConfigAction()
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
