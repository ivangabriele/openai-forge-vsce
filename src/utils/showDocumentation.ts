import fs from 'fs'
import { join } from 'path'
import { Uri, commands } from 'vscode'

import { GlobalStateKey, getGlobalStateManager } from '../libs/GlobalStateManager'
import { InternalError } from '../libs/InternalError'

import type { DocumentationPath } from '../constants'

export async function showDocumentation(documentationRelativePath: DocumentationPath) {
  const extensionRootPath = await getGlobalStateManager().get(GlobalStateKey.EXTENSION__ROOT_PATH)
  if (!extensionRootPath) {
    throw new InternalError('`extensionRootPath` is undefined.')
  }

  const documentationAbsolutePath = join(extensionRootPath, documentationRelativePath)
  if (!fs.existsSync(documentationAbsolutePath)) {
    throw new InternalError(`This documentation does not exist: ${documentationAbsolutePath}.`)
  }

  const fileUri = Uri.file(documentationAbsolutePath)

  await commands.executeCommand('markdown.showPreview', fileUri)
}
