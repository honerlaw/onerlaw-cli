import { logError } from '@/utils/logger.mjs'
import { POLLING_INTERVAL_MS } from './constants.mjs'
import { getNewLogs } from './getNewLogs.mjs'

export async function pollLogs(
  logFilter: string,
  lastTimestamp: string | null
): Promise<never> {
  try {
    const { output, newTimestamp } = await getNewLogs(logFilter, lastTimestamp)

    if (output && output.trim()) {
      console.log(output.trim())
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS))

    // Continue polling with updated timestamp
    return pollLogs(logFilter, newTimestamp)
  } catch (pollError) {
    // Log error but continue polling
    logError(
      `Error polling logs: ${pollError instanceof Error ? pollError.message : String(pollError)}`
    )

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS))

    // Continue polling with same timestamp
    return pollLogs(logFilter, lastTimestamp)
  }
}
