import {
  logSuccess,
  logWarning,
  logError,
  logInfo,
  validateEnvironment,
  getBackendConfigPath,
  getTfvarsPath,
  writeFileSync,
  initializeTerraform,
} from '../../utils/index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'
import { Command } from 'commander'

const backendTemplate = (
  project: string,
  environment: string,
  environmentName: string
): string => `
bucket = "${project}-terraform-state"
prefix = "terraform/state/${environment}/${environmentName}"
`

const tfvarsTemplate = (
  project: string,
  environment: string,
  environmentName: string,
  imageUrl: string
): string => `
# Project configuration
project_id = "${project}"
environment = "${environment}"
environment_name = "${environmentName}"

# Networking
region = "us-central1"
zone = "us-central1-a"

# Cloud Run
image_url = "${imageUrl}"
service_name = "app-server"
port = 8080
cpu = "1000m"
memory = "512Mi"
max_instances = 10
min_instances = 0

# Cloud SQL
database_instance_name = "app-database"
database_name = "app_db"
database_user = "app_user"
database_password = "your-secure-password-here"

# Artifact Registry
registry_name = "${environment}-${environmentName}"
repository_name = "app-repository"
`

async function getImageFullyQualifiedName(
  project: string,
  environment: string,
  environmentName: string
): Promise<string> {
  const registryName = `${environment}-${environmentName}`
  const hostname = `us-central1-docker.pkg.dev`
  const imageName = 'app-server'
  const tag = 'latest'

  return `${hostname}/${project}/${registryName}/${imageName}:${tag}`
}

async function setupVarsAction(
  project: string,
  environment: string,
  environmentName: string
): Promise<void> {
  logSuccess(`Setting up backend configuration for project: ${project}`)
  logSuccess(`Environment: ${environment}`)

  // create the backend file to be used
  const backendPath = getBackendConfigPath()
  writeFileSync(
    backendPath,
    backendTemplate(project, environment, environmentName)
  )
  logSuccess(`Created ${backendPath}...`)

  // create the ${TERRAFORM_TFVARS_FILE} file
  const tfvarsPath = getTfvarsPath()
  writeFileSync(
    tfvarsPath,
    tfvarsTemplate(
      project,
      environment,
      environmentName,
      await getImageFullyQualifiedName(project, environment, environmentName)
    )
  )
  logSuccess(`Created ${tfvarsPath}...`)

  await initializeTerraform()

  logSuccess('Backend configuration updated successfully!')
  logWarning('Next steps:')
  logInfo('1. Run: tsx src/index.ts init')
  logInfo('2. Run: tsx src/index.ts plan')
  logInfo('3. Run: tsx src/index.ts apply')
  logInfo('')
  logWarning(
    'Note: The first apply will create the state bucket and backend infrastructure.'
  )
}

export function registerSetupVarsCommand(program: Command): void {
  program
    .command('setup-vars')
    .description(`Setup backend configuration and ${TERRAFORM_TFVARS_FILE}`)
    .requiredOption('-p, --project <project-id>', 'Google Cloud Project ID')
    .requiredOption(
      '-e, --environment <env>',
      'environment (dev, staging, prod)'
    )
    .requiredOption('-n, --environment-name <name>', 'environment name')
    .action(
      async (options: {
        project: string
        environment: string
        environmentName: string
      }) => {
        try {
          validateEnvironment(options.environment)
          await setupVarsAction(
            options.project,
            options.environment,
            options.environmentName
          )
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
