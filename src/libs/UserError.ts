import { window } from 'vscode'

import { InternalError } from './InternalError'
import { handleMessageItems } from '../helpers/handleMessageItems'
import { MessageItemType, type MessageLink } from '../types'

const DEFAULT_MESSAGE = 'An internal error occured. Please check your Output > OpenAI Forge logs and report it.'

const ISSUE_MESSAGE_LINK: MessageLink = {
  label: 'Open an issue on GitHub',
  type: MessageItemType.LINK,
  url: 'https://github.com/ivangabriele/openai-forge-vsce/issues',
}

export class UserError extends InternalError {
  constructor(message: string = DEFAULT_MESSAGE, originalError?: unknown) {
    super(message, originalError)

    this.name = 'UserError'

    window.showErrorMessage(message, ISSUE_MESSAGE_LINK.label).then(handleMessageItems([ISSUE_MESSAGE_LINK]))
  }
}
