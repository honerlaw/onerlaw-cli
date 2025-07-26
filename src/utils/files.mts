import { readFile, writeFile, access, constants } from 'node:fs/promises'
import {
  existsSync,
  readFileSync as nodeReadFileSync,
  writeFileSync as nodeWriteFileSync,
} from 'node:fs'

/**
 * Read a file asynchronously with UTF-8 encoding
 */
export async function readFileUtf8(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, 'utf8')
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to read file ${filePath}: ${errorMessage}`)
  }
}

/**
 * Write content to a file asynchronously with UTF-8 encoding
 */
export async function writeFileUtf8(
  filePath: string,
  content: string
): Promise<void> {
  try {
    await writeFile(filePath, content, 'utf8')
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

/**
 * Read file content synchronously (for backward compatibility with existing code)
 */
export function readFileSync(filePath: string): string {
  return nodeReadFileSync(filePath, 'utf8')
}

/**
 * Write file content synchronously (for backward compatibility with existing code)
 */
export function writeFileSync(filePath: string, content: string): void {
  nodeWriteFileSync(filePath, content, 'utf8')
}
