import fs from 'fs'
import { join } from 'path'
import { Uri, commands, window, workspace } from 'vscode'

import { GlobalStateKey, getGlobalStateManager } from '../libs/GlobalStateManager'
import { InternalError } from '../libs/InternalError'

import type { DocumentationPath } from '../constants'

export async function showDocumentation(documentationRelativePath: DocumentationPath) {
  const { workspaceFolders } = workspace
  if (!workspaceFolders) {
    window.showErrorMessage('No workspace is opened.')

    return
  }

  const extensionRootPath = await getGlobalStateManager().get(GlobalStateKey.EXTENSION__ROOT_PATH)
  if (!extensionRootPath) {
    throw new InternalError('`extensionRootPath` is undefined.')
  }

  const documentationAbsolutePath = join(extensionRootPath, documentationRelativePath)
  if (!fs.existsSync(documentationAbsolutePath)) {
    throw new InternalError(`This documentation does not exist: ${documentationAbsolutePath}.`)
  }

  const fileUri = Uri.file(documentationAbsolutePath)

  // const document = await workspace.openTextDocument(fileUri)
  // await window.showTextDocument(document)
  await commands.executeCommand('markdown.showPreview', fileUri)
}
