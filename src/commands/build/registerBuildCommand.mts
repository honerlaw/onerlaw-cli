import { Command } from 'commander'
import { logSuccess, logError } from '@/utils/index.mjs'
import { buildAction } from './buildAction.mjs'
import { loadConfigFromPrompt } from '@/config/loadConfigFromPrompt.mjs'
import { select, input } from '@/utils/prompts.mjs'
import { DEFAULT_IMAGE_NAME } from './constants.mjs'

export function registerBuildCommand(program: Command): void {
  program
    .command('build')
    .description(
      'Build and push a Docker image to Artifact Registry (us-central1-docker.pkg.dev)'
    )
    .action(async () => {
      try {
        const config = await loadConfigFromPrompt()
        const selection = config.selection

        const project = selection.project
        const environment = selection.environment
        const environmentName = selection.environmentName

        const apps = selection.apps ?? null
        const selectedAppName =
          apps && apps.length > 0
            ? await select(
                'Select an app to build:',
                apps.map(app => ({ name: app.name, value: app.name }))
              )
            : await input('Enter Docker image/app name:', DEFAULT_IMAGE_NAME)

        const imageName = selectedAppName || DEFAULT_IMAGE_NAME

        await buildAction({
          project,
          environment,
          environmentName,
          imageName,
        })

        logSuccess('Done!')
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        logError(`Error: ${errorMessage}`)
        process.exit(1)
      }
    })
}
