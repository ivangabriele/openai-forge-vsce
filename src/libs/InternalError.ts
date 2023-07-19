import { LogLevel, logger } from './Logger'

export class InternalError extends Error {
  readonly originalError: unknown

  constructor(message: string, originalError?: unknown) {
    super(message)

    this.name = 'InternalError'
    this.originalError = originalError

    logger.log(this.message, this.originalError, LogLevel.ERROR)
  }
}
