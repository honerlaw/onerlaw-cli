import { runGcloudCommand } from '@/utils/commands.mjs'
import { logSuccess } from '@/utils/logger.mjs'
import { DEFAULT_LOG_LIMIT } from './constants.mjs'
import { formatLogEntry } from './formatLogEntry.mjs'
import { extractLatestTimestamp } from './extractLatestTimestamp.mjs'

export async function fetchRecentLogs(
  logFilter: string
): Promise<string | null> {
  const recentArgs = [
    'logging',
    'read',
    logFilter,
    '--limit',
    String(DEFAULT_LOG_LIMIT),
    '--format',
    'json',
    '--order',
    'desc',
  ]

  const recentOutput = await runGcloudCommand(recentArgs, {}, true)
  try {
    const recentEntries = recentOutput ? JSON.parse(String(recentOutput)) : []
    if (Array.isArray(recentEntries) && recentEntries.length > 0) {
      // Print newest first
      for (const entry of recentEntries) {
        console.log(formatLogEntry(entry))
      }
      return extractLatestTimestamp(recentEntries)
    } else {
      logSuccess('No logs found for this application')
      return null
    }
  } catch {
    // If parsing fails, just print raw output
    if (recentOutput && String(recentOutput).trim()) {
      console.log(String(recentOutput).trim())
    } else {
      logSuccess('No logs found for this application')
    }
    return null
  }
}
