import { Command } from 'commander'
import { logSuccess, logError } from '../../utils/index.mjs'
import { setupAction } from './setupAction.mjs'
import { loadConfigFromPrompt } from '@/config/loadConfigFromPrompt.mjs'

export function registerSetupCommand(program: Command): void {
  program
    .command('setup')
    .description(`Setup backend configuration and terraform.tfvars`)
    .action(async () => {
      try {
        const config = await loadConfigFromPrompt()
        await setupAction(config)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
