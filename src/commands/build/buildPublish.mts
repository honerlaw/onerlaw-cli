import { Command } from 'commander'
import { ENVIRONMENT_OPTION } from '../../utils/options.mjs'
import { buildPublishAction } from './buildPublishAction.mjs'

export function registerBuildCommand(program: Command): void {
  program
    .command('build')
    .description(
      'Build and publish Docker image to Google Container Registry (gcr.io)'
    )
    .requiredOption('-p, --project <project-id>', 'Google Cloud Project ID')
    .addOption(ENVIRONMENT_OPTION)
    .requiredOption('-n, --environment-name <name>', 'environment name')
    .option('-i, --image-name <name>', 'Docker image name')
    .option('-t, --tag <tag>', 'Docker image tag')
    .option('-f, --dockerfile <path>', 'Path to Dockerfile')
    .option('-c, --context <path>', 'Build context path')
    .option('--no-cache', 'Disable Docker build cache')
    .action(async options => {
      await buildPublishAction({
        project: options.project,
        environment: options.environment,
        environmentName: options.environmentName,
        imageName: options.imageName,
        tag: options.tag,
        dockerfilePath: options.dockerfile,
        contextPath: options.context,
        noCache: options.noCache,
      })
    })
}
