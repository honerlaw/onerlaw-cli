import { Command } from 'commander'
import {
  logSuccess,
  logError,
  runCommand,
  withTerraformDirectory,
} from '../../utils/index.mjs'

async function validateAction(): Promise<void> {
  logSuccess('Validating Terraform configuration...')

  await withTerraformDirectory(async () => {
    await runCommand('terraform', ['validate'])
    logSuccess('Terraform configuration is valid!')
  })
}

export function registerValidateCommand(program: Command): void {
  program
    .command('validate')
    .description('Validate Terraform configuration')
    .action(async () => {
      try {
        await validateAction()
        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
