import { Command } from 'commander'
import { logSuccess, logError } from '../../utils/index.mjs'
import { deployAction } from './deployAction.mjs'
import { loadConfigFromPrompt } from '@/config/loadConfigFromPrompt.mjs'

export function registerDeployCommand(program: Command): void {
  program
    .command('deploy')
    .description(`Deploy infrastructure using Terraform`)
    .action(async () => {
      try {
        const config = await loadConfigFromPrompt()
        await deployAction(config)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
