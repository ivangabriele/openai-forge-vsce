import { window } from 'vscode'

import { InternalError } from './InternalError'

const DEFAULT_MESSAGE = 'Something unexpected happened.'

export class UserError extends InternalError {
  constructor(message: string = DEFAULT_MESSAGE, originalError?: unknown) {
    super(message, originalError)

    this.name = 'UserError'

    window.showErrorMessage(message)
  }
}
