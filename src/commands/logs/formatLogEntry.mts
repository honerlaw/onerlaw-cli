import type { LogEntry } from './types.mjs'

export function formatLogEntry(entry: LogEntry): string {
  const timestamp: string = entry?.timestamp ?? ''
  const severity: string = entry?.severity ?? ''
  const textPayload: string | null = entry?.textPayload ?? null
  const jsonPayload: Record<string, unknown> | null = entry?.jsonPayload ?? null
  const protoPayload: Record<string, unknown> | null =
    entry?.protoPayload ?? null

  const jsonMessage =
    (jsonPayload && (jsonPayload as Record<string, unknown>).message) ||
    (jsonPayload && (jsonPayload as Record<string, unknown>).msg) ||
    (jsonPayload && (jsonPayload as Record<string, unknown>).stack) ||
    null

  const protoMessage =
    (protoPayload &&
      (protoPayload as Record<string, unknown>).status &&
      (
        (protoPayload as Record<string, unknown>).status as Record<
          string,
          unknown
        >
      ).message) ||
    null

  const message: string =
    (textPayload as string | null) ||
    (jsonMessage as string | null) ||
    (protoMessage as string | null) ||
    ''

  return `${timestamp} ${severity} ${message}`.trim()
}
