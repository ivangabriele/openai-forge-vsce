import { window } from 'vscode'

import { UserError } from '../libs/UserError'

export function getCurrentDocumentPath(): string {
  const editor = window.activeTextEditor
  if (!editor) {
    throw new UserError('No active text editor.')
  }

  return editor.document.uri.fsPath
}
