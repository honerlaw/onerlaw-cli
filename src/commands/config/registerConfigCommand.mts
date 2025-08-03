import { Command } from 'commander'
import { registerConfigNewCommand } from './new/registerConfigNewCommand.mjs'
import { registerConfigModifyCommand } from './modify/modifyCommandAction.mjs'
import { registerConfigRemoveCommand } from './remove/registerConfigRemoveCommand.mjs'

export function registerConfigCommand(program: Command): void {
  const configCommand = program
    .command('config')
    .description('Configure onerlaw settings')

  registerConfigNewCommand(configCommand)
  registerConfigModifyCommand(configCommand)
  registerConfigRemoveCommand(configCommand)
}
