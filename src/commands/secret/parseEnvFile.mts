import { readFile } from '@/utils/index.mjs'

function isCommentOrEmpty(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.length === 0 || trimmed.startsWith('#')
}

function parseLine(line: string): [string, string] | null {
  // Supports KEY=VALUE and KEY="VALUE with = and #"
  const idx = line.indexOf('=')
  if (idx === -1) {
    return null
  }
  const rawKey = line.slice(0, idx).trim()
  let rawValue = line.slice(idx + 1).trim()

  if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
    rawValue = rawValue.slice(1, -1)
  } else if (rawValue.startsWith("'") && rawValue.endsWith("'")) {
    rawValue = rawValue.slice(1, -1)
  }

  if (!rawKey) {
    return null
  }
  return [rawKey.trim(), rawValue.trim()]
}

export async function parseEnvFile(
  filePath: string
): Promise<Record<string, string>> {
  const content = await readFile(filePath)
  const lines = content.split(/\r?\n/)
  const result: Record<string, string> = {}

  for (const line of lines) {
    if (isCommentOrEmpty(line)) {
      continue
    }
    const parsed = parseLine(line)
    if (!parsed) {
      continue
    }
    const [key, value] = parsed
    result[key] = value
  }

  return result
}
