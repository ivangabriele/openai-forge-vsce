import { workspace } from 'vscode'

import { UserError } from '../libs/UserError'

export function getUserWorkspaceRootPath(): string {
  const { workspaceFolders } = workspace
  if (!workspaceFolders) {
    throw new UserError('You are not in a workspace.')
  }

  const firstWorkspaceFolder = workspaceFolders[0]
  if (!firstWorkspaceFolder) {
    throw new UserError('You are not in a workspace.')
  }

  return firstWorkspaceFolder.uri.fsPath
}
