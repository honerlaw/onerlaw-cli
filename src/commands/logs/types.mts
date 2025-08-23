export type LogEntry = {
  timestamp?: string
  severity?: string
  textPayload?: string | null
  jsonPayload?: Record<string, unknown> | null
  protoPayload?: Record<string, unknown> | null
}
