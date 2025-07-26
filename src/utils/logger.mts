import { consola } from 'consola'

// Create a custom logger that wraps consola
export const logger = consola.create({
  level: process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 4, // Default to info level
})

// Export convenience methods
export const log = logger.log
export const logError = logger.error
export const logSuccess = logger.success
export const logWarning = logger.warn
export const logInfo = logger.info
export const logDebug = logger.debug
