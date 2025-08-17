import { Command } from 'commander'
import { logError, logSuccess } from '@/utils/index.mjs'
import { loadConfigFromPrompt } from '@/config/loadConfigFromPrompt.mjs'
import { deletePrefixedSecrets } from '@/utils/index.mjs'

export function registerSecretDestroyCommand(parent: Command): void {
  parent
    .command('destroy')
    .description('Delete all secrets for the selected environment prefix')
    .action(async () => {
      try {
        const config = await loadConfigFromPrompt()
        await deletePrefixedSecrets(config)
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
