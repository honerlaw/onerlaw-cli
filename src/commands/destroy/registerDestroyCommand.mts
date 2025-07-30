import { Command } from 'commander'
import {
  logError,
  logSuccess,
  validateTfvars,
  setupTerraform,
} from '../../utils/index.mjs'
import { loadConfigFromPrompt } from '../../config/loadConfigFromPrompt.mjs'
import { performDestroy } from './performDestroy.mjs'

async function destroyAction(): Promise<void> {
  logError(`Destroying infrastructure...`)

  const config = await loadConfigFromPrompt()
  await setupTerraform(config)
  await validateTfvars()
  await performDestroy(config)
}

export function registerDestroyCommand(program: Command): void {
  program
    .command('destroy')
    .description('Destroy Terraform infrastructure')
    .action(async () => {
      try {
        await destroyAction()
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
