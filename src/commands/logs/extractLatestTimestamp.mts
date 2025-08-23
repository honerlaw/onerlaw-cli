import type { LogEntry } from './types.mjs'

export function extractLatestTimestamp(entries: unknown): string | null {
  if (!Array.isArray(entries) || entries.length === 0) {
    return null
  }

  // Find the entry with the latest timestamp
  const validEntries = entries
    .map(entry => (entry as LogEntry)?.timestamp)
    .filter((ts): ts is string => typeof ts === 'string')
    .map(ts => ({ timestamp: ts, time: new Date(ts).getTime() }))

  if (validEntries.length === 0) {
    return null
  }

  const latest = validEntries.reduce((latest, current) =>
    current.time > latest.time ? current : latest
  )

  return latest.timestamp
}
