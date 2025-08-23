import { Command } from 'commander'
import { logSuccess, logError } from '../../utils/index.mjs'
import { logsAction } from './logsAction.mjs'
import { loadConfigFromPrompt } from '@/config/loadConfigFromPrompt.mjs'

export function registerLogsCommand(program: Command): void {
  program
    .command('logs')
    .description('Fetch recent logs for a Cloud Run application')
    .option('--tail', 'Continuously poll for new logs')
    .action(async options => {
      try {
        const config = await loadConfigFromPrompt()
        await logsAction(config, options.tail || false)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
