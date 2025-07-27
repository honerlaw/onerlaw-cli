import path from 'path'
import { fileURLToPath } from 'url'
import { checkFileExists } from './files.mjs'
import { BACKEND_TF_FILE, TERRAFORM_TFVARS_FILE } from '@/constants.mjs'

type DirectoryContext = {
  originalCwd: string
  currentCwd: string
}

/**
 * Get the current directory path for ES modules
 */
function getCurrentDir(): string {
  return path.dirname(fileURLToPath(import.meta.url))
}

/**
 * Get the project root directory
 */
export function getProjectRoot(): string {
  return path.resolve(getCurrentDir(), '../..')
}

/**
 * Get the terraform directory path
 */
export function getTerraformPath(): string {
  return path.join(getProjectRoot(), 'terraform')
}

/**
 * Resolve a path relative to the project root
 */
export function resolveFromProjectRoot(relativePath: string): string {
  return path.resolve(getProjectRoot(), relativePath)
}

/**
 * Resolve a path relative to the terraform directory
 */
export function resolveFromTerraform(relativePath: string): string {
  return path.resolve(getTerraformPath(), relativePath)
}

/**
 * Get the terraform tfvars file path
 */
export function getTfvarsPath(): string {
  return resolveFromTerraform(TERRAFORM_TFVARS_FILE)
}

/**
 * Get the backend configuration file path
 */
export function getBackendConfigPath(): string {
  return resolveFromTerraform(BACKEND_TF_FILE)
}

/**
 * Get the local state file path
 */
export function getLocalStatePath(): string {
  return resolveFromTerraform('terraform.tfstate')
}

/**
 * Change to a directory and return context for restoration
 */
export function changeDirectory(targetPath: string): DirectoryContext {
  const originalCwd = process.cwd()
  process.chdir(targetPath)
  return {
    originalCwd,
    currentCwd: process.cwd(),
  }
}

/**
 * Restore the original working directory
 */
export function restoreDirectory(context: DirectoryContext): void {
  process.chdir(context.originalCwd)
}

/**
 * Execute a function in a specific directory context
 */
export async function withDirectory<T>(
  targetPath: string,
  operation: () => Promise<T>
): Promise<T> {
  const context = changeDirectory(targetPath)
  try {
    return await operation()
  } finally {
    restoreDirectory(context)
  }
}

/**
 * Execute a function in the terraform directory context
 */
export async function withTerraformDirectory<T>(
  operation: () => Promise<T>
): Promise<T> {
  return withDirectory(getTerraformPath(), operation)
}

/**
 * Check if terraform tfvars file exists
 */
export function checkTfvarsExists(): boolean {
  return checkFileExists(getTfvarsPath())
}

/**
 * Check if backend configuration exists
 */
export function checkBackendConfigExists(): boolean {
  return checkFileExists(getBackendConfigPath())
}

/**
 * Check if local state file exists
 */
export function checkLocalStateExists(): boolean {
  return checkFileExists(getLocalStatePath())
}

/**
 * Get the current working directory
 */
export function getCurrentWorkingDirectory(): string {
  return process.cwd()
}

/**
 * Join paths using the path.join utility
 */
export function joinPaths(...paths: string[]): string {
  return path.join(...paths)
}

/**
 * Resolve a path to an absolute path
 */
export function resolvePath(...paths: string[]): string {
  return path.resolve(...paths)
}
