import { Command } from 'commander'
import { logSuccess, logError } from '@/utils/logger.mjs'
import { modifyConfigAction } from './modifyConfigAction.mjs'

export function registerConfigModifyCommand(configCommand: Command): void {
  configCommand
    .command('modify')
    .description('Modify existing configurations')
    .action(async () => {
      try {
        await modifyConfigAction()
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
