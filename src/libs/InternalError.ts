export class InternalError extends Error {
  readonly originalError: unknown

  constructor(message: string, originalError?: unknown) {
    super(message)

    this.name = 'InternalError'
    this.originalError = originalError

    this.#log()
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      originalErrorAsString: String(this.originalError),
      stack: this.stack,
    }
  }

  #log() {
    // eslint-disable-next-line no-null/no-null
    console.error(this.toJSON(), null, 2)
    console.error(this.originalError)
  }
}
