import { Command } from 'commander'
import { registerSecretDestroyCommand } from './destroy/registerSecretDestroyCommand.mjs'
import { registerSecretAddCommand } from './add/registerSecretAddCommand.mjs'

export function registerSecretCommand(program: Command): void {
  const secretCmd = program
    .command('secret')
    .description('Manage Google Cloud secrets')

  registerSecretAddCommand(secretCmd)
  registerSecretDestroyCommand(secretCmd)
}
