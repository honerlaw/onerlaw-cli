import { Command } from 'commander'
import { logSuccess, logError } from '@/utils/logger.mjs'
import { removeConfigAction } from './removeConfigAction.mjs'

export function registerConfigRemoveCommand(configCommand: Command): void {
  configCommand
    .command('remove')
    .description('Remove existing configurations')
    .action(async () => {
      try {
        await removeConfigAction()
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
