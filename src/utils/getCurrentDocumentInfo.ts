import path from 'path'
import { window } from 'vscode'

import { getWorkspaceRootPath } from './getWorkspaceRootPath'
import { UserError } from '../libs/UserError'

import type { DocumentInfo } from '../types'

export function getCurrentDocumentInfo(): DocumentInfo {
  const editor = window.activeTextEditor
  if (!editor) {
    throw new UserError('No active text editor.')
  }

  const workspaceRootPath = getWorkspaceRootPath()

  const absolutePath = editor.document.uri.fsPath
  const relativePath = path.relative(workspaceRootPath, absolutePath)
  const source = editor.document.getText()

  return {
    absolutePath,
    relativePath,
    source,
  }
}
