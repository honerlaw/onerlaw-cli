import { Command } from 'commander'
import { initAction } from './initAction.mjs'
import { logSuccess, logError } from '@/utils/logger.mjs'

export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize a new onerlaw config in the current directory')
    .action(async () => {
      try {
        await initAction()
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
