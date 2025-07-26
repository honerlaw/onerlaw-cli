import {
  logError,
  logSuccess,
  runCommand,
  validateEnvironment,
  resolvePath,
  readFileSync,
} from '../../utils/index.mjs'
import os from 'os'
import { Command } from 'commander'

type BuildPublishOptions = {
  project: string
  environment: string
  environmentName: string
  imageName?: string
  tag?: string
  dockerfilePath?: string
  contextPath?: string
  noCache?: boolean
  // Only GCR is supported now
}

async function buildPublishAction(options: BuildPublishOptions): Promise<void> {
  const {
    project,
    environment,
    environmentName,
    imageName = 'app-server',
    tag = 'latest',
    dockerfilePath = 'Dockerfile',
    contextPath = '.',
    noCache = false,
  } = options

  try {
    logSuccess(
      `Building and publishing Docker image for ${environment} environment...`
    )

    const registryName = `${environment}-${environmentName}`
    const hostname = `us-central1-docker.pkg.dev`
    const fullImageName = `${hostname}/${project}/${registryName}/${imageName}:${tag}`

    logSuccess(`Full image name: ${fullImageName}`)
    logSuccess(`Configuring Docker authentication for ${registryName}...`)
    await runCommand('gcloud', [
      'auth',
      'configure-docker',
      hostname,
      '--quiet',
    ])

    // fetch the NPM_TOKEN from the root npmrc file
    const npmToken = readFileSync(resolvePath(os.homedir(), '.npmrc'))
      .split('_authToken=')[1]
      .trim()

    const args = [
      'build',
      '--secret',
      'id=NPM_TOKEN',
      '--platform',
      'linux/amd64',
      '-f',
      dockerfilePath,
      '-t',
      fullImageName,
      contextPath,
    ]

    if (noCache) {
      args.push('--no-cache')
    }

    // Build the Docker image
    logSuccess('Building Docker image...')
    await runCommand('docker', args, {
      env: {
        NPM_TOKEN: npmToken,
      },
    })

    logSuccess('Pushing Docker image to gcr.io...')
    await runCommand('docker', ['push', fullImageName])

    logSuccess(`Successfully built and published: ${fullImageName}`)
    logSuccess(`Image is now available at: ${fullImageName}`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logError(`Error building and publishing Docker image: ${errorMessage}`)
    throw error
  }
}

export function registerBuildPublishCommand(program: Command): void {
  program
    .command('build-publish')
    .description(
      'Build and publish Docker image to Google Container Registry (gcr.io)'
    )
    .requiredOption('-p, --project <project-id>', 'Google Cloud Project ID')
    .requiredOption(
      '-e, --environment <env>',
      'environment (dev, staging, prod)'
    )
    .requiredOption('-n, --environment-name <name>', 'environment name')
    .option('-i, --image-name <name>', 'Docker image name', 'app-server')
    .option('-t, --tag <tag>', 'Docker image tag', 'latest')
    .option('-f, --dockerfile <path>', 'Path to Dockerfile', 'Dockerfile')
    .option('-c, --context <path>', 'Build context path', '.')
    .option('--no-cache', 'Disable Docker build cache', false)
    .action(
      async (options: {
        project: string
        environment: string
        environmentName: string
        imageName: string
        tag: string
        dockerfile: string
        context: string
        noCache: boolean
      }) => {
        try {
          validateEnvironment(options.environment)
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
          logSuccess('Done!')
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          logError(`Error: ${errorMessage}`)
          process.exit(1)
        }
      }
    )
}
