import { setGcloudProject } from '@/utils/commands.mjs'
import { logSuccess, logError } from '@/utils/logger.mjs'
import { type LoadedConfig } from '@/config/loadConfigFromPrompt.mjs'
import { selectApp } from './selectApp.mjs'
import { buildServiceName } from './buildServiceName.mjs'
import { buildLogFilter } from './buildLogFilter.mjs'
import { fetchRecentLogs } from './fetchRecentLogs.mjs'
import { setupGracefulShutdown } from './setupGracefulShutdown.mjs'
import { pollLogs } from './pollLogs.mjs'

export async function logsAction(
  config: LoadedConfig,
  tail: boolean
): Promise<void> {
  const {
    selection: { project, environment, environmentName },
    configs,
  } = config

  // Find the selected project config
  const projectConfig = configs.find(c => c.project === project)
  if (!projectConfig) {
    throw new Error(`Project configuration not found for: ${project}`)
  }

  const apps = projectConfig.environment.apps

  if (!apps || apps.length === 0) {
    throw new Error(
      'No applications found in configuration. Please configure at least one app first.'
    )
  }

  // Select the application
  const selectedApp = await selectApp(apps)

  // Construct the actual Cloud Run service name as deployed by Terraform
  const serviceName = buildServiceName(
    environment,
    environmentName,
    selectedApp.name
  )

  logSuccess(`Fetching logs for service: ${serviceName}`)

  // Set gcloud project
  await setGcloudProject(project)

  // Build the log filter
  const logFilter = buildLogFilter(serviceName)

  if (tail) {
    logSuccess('Tailing logs. Press Ctrl+C to stop')
  }

  try {
    // Fetch recent logs first and get the latest timestamp
    const latestTimestamp = await fetchRecentLogs(logFilter)

    // If tail option is enabled, start polling for new logs
    if (tail) {
      // Setup graceful shutdown handlers
      setupGracefulShutdown()

      // Start polling for new logs from the latest timestamp
      await pollLogs(logFilter, latestTimestamp)
    }
  } catch (error) {
    if (error instanceof Error) {
      logError(`Failed to fetch logs: ${error.message}`)
      logError(
        'Make sure you have gcloud CLI installed and are authenticated with the correct project.'
      )
    } else {
      logError('Unknown error occurred while fetching logs')
    }
    throw error
  }
}
