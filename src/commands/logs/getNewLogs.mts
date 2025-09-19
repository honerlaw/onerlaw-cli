import { runGcloudCommand } from '@/utils/commands.mjs'
import { formatLogEntry } from './formatLogEntry.mjs'
import { extractLatestTimestamp } from './extractLatestTimestamp.mjs'

export async function getNewLogs(
  logFilter: string,
  lastTimestamp: string | null
): Promise<{ output: string; newTimestamp: string | null }> {
  const combinedFilter = lastTimestamp
    ? `(${logFilter}) AND timestamp>"${lastTimestamp}"`
    : logFilter

  const tailArgs = [
    'logging',
    'read',
    combinedFilter,
    '--format',
    'json',
    '--order',
    'asc',
    '--limit',
    '50',
  ]

  const output = await runGcloudCommand(tailArgs, {}, true)

  try {
    const entries = output ? JSON.parse(String(output)) : []
    if (Array.isArray(entries)) {
      if (entries.length > 0) {
        const lines: string[] = []
        for (const entry of entries) {
          lines.push(formatLogEntry(entry))
        }
        const printed = lines.join('\n')
        const newTimestamp = extractLatestTimestamp(entries) ?? lastTimestamp
        return { output: printed, newTimestamp }
      } else {
        // Empty array means no new logs - return empty output
        return { output: '', newTimestamp: lastTimestamp }
      }
    }
  } catch {
    // If JSON parsing fails, check if it's an empty result
    const trimmedOutput = String(output || '').trim()
    if (trimmedOutput === '[]' || trimmedOutput === '') {
      return { output: '', newTimestamp: lastTimestamp }
    }
    // Otherwise return the raw output for debugging
    return { output: trimmedOutput, newTimestamp: lastTimestamp }
  }

  // Fallback - should not reach here
  return { output: '', newTimestamp: lastTimestamp }
}
