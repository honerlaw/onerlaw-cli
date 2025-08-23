import { logSuccess } from '@/utils/logger.mjs'

export function setupGracefulShutdown(): void {
  const handleShutdown = (): void => {
    logSuccess('Stopping log tail...')
    process.exit(0)
  }

  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}
