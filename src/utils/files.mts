import {
  readFile as readFilePromises,
  writeFile as writeFilePromises,
  access,
  constants,
} from 'node:fs/promises'
import { existsSync } from 'node:fs'

/**
 * Read a file asynchronously with UTF-8 encoding
 */
export async function readFile(filePath: string): Promise<string> {
  try {
    return await readFilePromises(filePath, 'utf8')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to read file ${filePath}: ${errorMessage}`)
  }
}

/**
 * Write content to a file asynchronously with UTF-8 encoding
 */
export async function writeFile(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await writeFilePromises(filePath, content, 'utf8')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to write file ${filePath}: ${errorMessage}`)
  }
}

/**
 * Check if a file exists and is readable
 */
export async function checkFileAccess(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.R_OK)
    return true
  } catch {
    return false
  }
}

/**
 * Check if a file exists synchronously (for backward compatibility)
 */
export function checkFileExists(filePath: string): boolean {
  return existsSync(filePath)
}
